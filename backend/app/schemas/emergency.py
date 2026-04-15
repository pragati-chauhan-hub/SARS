from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PriorityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EmergencyStatus(str, Enum):
    PENDING = "pending"
    EN_ROUTE = "en_route"
    AT_SCENE = "at_scene"
    RESOLVED = "resolved"


class EmergencyBase(BaseModel):
    patient_name: str
    patient_phone: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    condition: Optional[str] = None
    priority: Optional[PriorityLevel] = PriorityLevel.MEDIUM
    caller_name: Optional[str] = None
    caller_phone: Optional[str] = None
    description: Optional[str] = None


class EmergencyCreate(EmergencyBase):
    pass


class EmergencyUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    condition: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    status: Optional[EmergencyStatus] = None
    caller_name: Optional[str] = None
    caller_phone: Optional[str] = None
    description: Optional[str] = None


class Emergency(EmergencyBase):
    id: int
    status: EmergencyStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TranscriptionResponse(BaseModel):
    """Response from AI transcription service"""
    patient_name: str
    location: str
    condition: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    description: Optional[str] = None
    caller_name: Optional[str] = None
    caller_phone: Optional[str] = None
    transcribed_text: Optional[str] = None


class AmbulanceStatus(str, Enum):
    AVAILABLE = "available"
    EN_ROUTE = "en_route"
    AT_SCENE = "at_scene"
    RETURNING = "returning"


class AmbulanceBase(BaseModel):
    name: str
    vehicle_number: str
    ambulance_type: Optional[str] = "ALS"
    capacity: Optional[int] = 2
    equipment: Optional[str] = None


class AmbulanceCreate(AmbulanceBase):
    driver_id: Optional[int] = None


class AmbulanceUpdate(BaseModel):
    name: Optional[str] = None
    vehicle_number: Optional[str] = None
    status: Optional[AmbulanceStatus] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ambulance_type: Optional[str] = None
    capacity: Optional[int] = None
    equipment: Optional[str] = None
    driver_id: Optional[int] = None


class Driver(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    license_number: str
    qualifications: Optional[str] = None

    class Config:
        from_attributes = True


class Ambulance(AmbulanceBase):
    id: int
    status: AmbulanceStatus
    latitude: float
    longitude: float
    driver_id: Optional[int] = None
    driver: Optional[Driver] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DispatchBase(BaseModel):
    emergency_id: int
    ambulance_id: int
    hospital_name: Optional[str] = None
    hospital_location: Optional[str] = None
    hospital_latitude: Optional[float] = None
    hospital_longitude: Optional[float] = None


class DispatchCreate(DispatchBase):
    pass


class Dispatch(DispatchBase):
    id: int
    distance_km: Optional[float] = None
    estimated_time_minutes: Optional[int] = None
    whatsapp_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RouteOption(BaseModel):
    ambulance_id: int
    ambulance_name: str
    distance_km: float
    duration_minutes: int
    eta_minutes: int
    route_polyline: Optional[str] = None


class OptimizationRequest(BaseModel):
    emergency_id: int
    emergency_latitude: float
    emergency_longitude: float
    hospital_latitude: Optional[float] = None
    hospital_longitude: Optional[float] = None


class OptimizationResponse(BaseModel):
    routes: List[RouteOption]
    recommended_ambulance_id: int


class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "dispatcher"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class LoginRequest(BaseModel):
    username: str
    password: str
