"""
Dispatch management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.emergency import Dispatch as DispatchModel, Emergency as EmergencyModel, Ambulance as AmbulanceModel
from app.schemas.emergency import Dispatch, DispatchCreate, OptimizationRequest, OptimizationResponse, RouteOption
from app.services.whatsapp_service import whatsapp_service
from app.services.route_optimizer import route_optimizer
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/dispatch", tags=["dispatch"])


@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_routes(
    request: OptimizationRequest,
    db: Session = Depends(get_db)
):
    """Get optimized routes for all available ambulances"""
    try:
        # Get all available ambulances
        ambulances = db.query(AmbulanceModel).filter(
            AmbulanceModel.status == "available"
        ).all()
        
        if not ambulances:
            raise HTTPException(status_code=400, detail="No available ambulances")
        
        ambulance_data = [
            {
                "id": a.id,
                "name": a.name,
                "latitude": a.latitude,
                "longitude": a.longitude
            }
            for a in ambulances
        ]
        
        routes, recommended_id = await route_optimizer.optimize_routes(
            emergency_lat=request.emergency_latitude,
            emergency_lon=request.emergency_longitude,
            ambulances=ambulance_data,
            hospital_lat=request.hospital_latitude,
            hospital_lon=request.hospital_longitude
        )
        
        return OptimizationResponse(
            routes=routes,
            recommended_ambulance_id=recommended_id
        )
    except Exception as e:
        logger.error(f"Error optimizing routes: {str(e)}")
        raise HTTPException(status_code=500, detail="Error optimizing routes")


@router.post("", response_model=Dispatch)
async def create_dispatch(
    dispatch: DispatchCreate,
    db: Session = Depends(get_db)
):
    """Create dispatch assignment and send WhatsApp notification"""
    try:
        # Verify emergency and ambulance exist
        emergency = db.query(EmergencyModel).filter(EmergencyModel.id == dispatch.emergency_id).first()
        if not emergency:
            raise HTTPException(status_code=404, detail="Emergency not found")
        
        ambulance = db.query(AmbulanceModel).filter(AmbulanceModel.id == dispatch.ambulance_id).first()
        if not ambulance:
            raise HTTPException(status_code=404, detail="Ambulance not found")
        
        # Create dispatch record
        db_dispatch = DispatchModel(
            emergency_id=dispatch.emergency_id,
            ambulance_id=dispatch.ambulance_id,
            hospital_name=dispatch.hospital_name,
            hospital_location=dispatch.hospital_location,
            hospital_latitude=dispatch.hospital_latitude,
            hospital_longitude=dispatch.hospital_longitude,
            distance_km=0.0,
            estimated_time_minutes=5,
            whatsapp_status="pending"
        )
        db.add(db_dispatch)
        db.commit()
        db.refresh(db_dispatch)
        
        # Send WhatsApp notification to driver
        if ambulance.driver:
            whatsapp_result = await whatsapp_service.send_dispatch_notification(
                driver_phone=ambulance.driver.phone,
                ambulance_name=ambulance.name,
                patient_name=emergency.patient_name,
                location=emergency.location,
                hospital_name=dispatch.hospital_name or "Nearest Hospital",
                hospital_address=dispatch.hospital_location or "TBD",
                eta_minutes=db_dispatch.estimated_time_minutes
            )
            db_dispatch.whatsapp_status = whatsapp_result.get("status", "failed")
            db.commit()
            db.refresh(db_dispatch)
        
        logger.info(f"Created dispatch: {db_dispatch.id}")
        return db_dispatch
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating dispatch: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating dispatch")


@router.get("/{dispatch_id}", response_model=Dispatch)
async def get_dispatch(
    dispatch_id: int,
    db: Session = Depends(get_db)
):
    """Get dispatch details"""
    dispatch = db.query(DispatchModel).filter(DispatchModel.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")
    return dispatch


@router.put("/{dispatch_id}/status")
async def update_dispatch_status(
    dispatch_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Update dispatch status"""
    dispatch = db.query(DispatchModel).filter(DispatchModel.id == dispatch_id).first()
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")
    
    # Update associated ambulance status
    ambulance = dispatch.ambulance
    if ambulance:
        ambulance.status = status
    
    db.commit()
    logger.info(f"Updated dispatch status: {dispatch_id} -> {status}")
    return {"message": "Status updated successfully"}
