"""
Emergency management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.emergency import Emergency as EmergencyModel, EmergencyStatus as EmergencyStatusEnum, PriorityLevel as PriorityLevelEnum
from app.schemas.emergency import Emergency, EmergencyCreate, EmergencyUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/emergencies", tags=["emergencies"])


@router.get("", response_model=List[Emergency])
async def list_emergencies(
    status: str = Query(None),
    priority: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List all emergencies with optional filtering"""
    query = db.query(EmergencyModel)
    
    if status:
        query = query.filter(EmergencyModel.status == status)
    if priority:
        query = query.filter(EmergencyModel.priority == priority)
    
    emergencies = query.offset(skip).limit(limit).all()
    return emergencies


@router.post("", response_model=Emergency)
async def create_emergency(
    emergency: EmergencyCreate,
    db: Session = Depends(get_db)
):
    """Create a new emergency"""
    db_emergency = EmergencyModel(
        patient_name=emergency.patient_name,
        patient_phone=emergency.patient_phone,
        location=emergency.location,
        latitude=emergency.latitude,
        longitude=emergency.longitude,
        condition=emergency.condition,
        priority=emergency.priority or PriorityLevelEnum.MEDIUM,
        caller_name=emergency.caller_name,
        caller_phone=emergency.caller_phone,
        description=emergency.description
    )
    db.add(db_emergency)
    db.commit()
    db.refresh(db_emergency)
    logger.info(f"Created emergency: {db_emergency.id}")
    return db_emergency


@router.get("/{emergency_id}", response_model=Emergency)
async def get_emergency(
    emergency_id: int,
    db: Session = Depends(get_db)
):
    """Get emergency details"""
    emergency = db.query(EmergencyModel).filter(EmergencyModel.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return emergency


@router.put("/{emergency_id}", response_model=Emergency)
async def update_emergency(
    emergency_id: int,
    emergency_update: EmergencyUpdate,
    db: Session = Depends(get_db)
):
    """Update emergency details"""
    emergency = db.query(EmergencyModel).filter(EmergencyModel.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
    
    update_data = emergency_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(emergency, field, value)
    
    db.commit()
    db.refresh(emergency)
    logger.info(f"Updated emergency: {emergency_id}")
    return emergency


@router.delete("/{emergency_id}")
async def delete_emergency(
    emergency_id: int,
    db: Session = Depends(get_db)
):
    """Delete an emergency"""
    emergency = db.query(EmergencyModel).filter(EmergencyModel.id == emergency_id).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
    
    db.delete(emergency)
    db.commit()
    logger.info(f"Deleted emergency: {emergency_id}")
    return {"message": "Emergency deleted successfully"}
