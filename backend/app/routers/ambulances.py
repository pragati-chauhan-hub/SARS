"""
Ambulance management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.emergency import Ambulance as AmbulanceModel, AmbulanceStatus as AmbulanceStatusEnum
from app.schemas.emergency import Ambulance, AmbulanceCreate, AmbulanceUpdate
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ambulances", tags=["ambulances"])


@router.get("", response_model=List[Ambulance])
async def list_ambulances(
    status: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List all ambulances with optional filtering"""
    query = db.query(AmbulanceModel)
    
    if status:
        query = query.filter(AmbulanceModel.status == status)
    
    ambulances = query.offset(skip).limit(limit).all()
    return ambulances


@router.get("/available", response_model=List[Ambulance])
async def list_available_ambulances(
    db: Session = Depends(get_db)
):
    """Get only available ambulances"""
    ambulances = db.query(AmbulanceModel).filter(
        AmbulanceModel.status == AmbulanceStatusEnum.AVAILABLE
    ).all()
    return ambulances


@router.post("", response_model=Ambulance)
async def create_ambulance(
    ambulance: AmbulanceCreate,
    db: Session = Depends(get_db)
):
    """Create a new ambulance"""
    db_ambulance = AmbulanceModel(
        name=ambulance.name,
        vehicle_number=ambulance.vehicle_number,
        ambulance_type=ambulance.ambulance_type or "ALS",
        capacity=ambulance.capacity or 2,
        equipment=ambulance.equipment,
        driver_id=ambulance.driver_id
    )
    db.add(db_ambulance)
    db.commit()
    db.refresh(db_ambulance)
    logger.info(f"Created ambulance: {db_ambulance.id}")
    return db_ambulance


@router.get("/{ambulance_id}", response_model=Ambulance)
async def get_ambulance(
    ambulance_id: int,
    db: Session = Depends(get_db)
):
    """Get ambulance details"""
    ambulance = db.query(AmbulanceModel).filter(AmbulanceModel.id == ambulance_id).first()
    if not ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    return ambulance


@router.put("/{ambulance_id}", response_model=Ambulance)
async def update_ambulance(
    ambulance_id: int,
    ambulance_update: AmbulanceUpdate,
    db: Session = Depends(get_db)
):
    """Update ambulance details or location"""
    ambulance = db.query(AmbulanceModel).filter(AmbulanceModel.id == ambulance_id).first()
    if not ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    
    update_data = ambulance_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ambulance, field, value)
    
    db.commit()
    db.refresh(ambulance)
    logger.info(f"Updated ambulance: {ambulance_id}")
    return ambulance
