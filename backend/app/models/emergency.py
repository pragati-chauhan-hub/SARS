from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.database import Base


class EmergencyStatus(str, enum.Enum):
    PENDING = "pending"
    EN_ROUTE = "en_route"
    AT_SCENE = "at_scene"
    RESOLVED = "resolved"


class PriorityLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AmbulanceStatus(str, enum.Enum):
    AVAILABLE = "available"
    EN_ROUTE = "en_route"
    AT_SCENE = "at_scene"
    RETURNING = "returning"


class Emergency(Base):
    __tablename__ = "emergencies"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(255), nullable=False)
    patient_phone = Column(String(20))
    location = Column(String(500), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    condition = Column(Text)
    priority = Column(Enum(PriorityLevel), default=PriorityLevel.MEDIUM)
    status = Column(Enum(EmergencyStatus), default=EmergencyStatus.PENDING)
    caller_name = Column(String(255))
    caller_phone = Column(String(20))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    dispatch = relationship("Dispatch", uselist=False, back_populates="emergency")


class Ambulance(Base):
    __tablename__ = "ambulances"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    vehicle_number = Column(String(50), unique=True, nullable=False)
    status = Column(Enum(AmbulanceStatus), default=AmbulanceStatus.AVAILABLE)
    latitude = Column(Float, default=0.0)
    longitude = Column(Float, default=0.0)
    ambulance_type = Column(String(20))  # ALS, BLS
    capacity = Column(Integer, default=2)
    equipment = Column(Text)  # JSON or comma-separated list
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    driver = relationship("Driver", back_populates="ambulances")
    dispatch = relationship("Dispatch", uselist=False, back_populates="ambulance")


class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    email = Column(String(255), unique=True)
    license_number = Column(String(50), unique=True, nullable=False)
    qualifications = Column(Text)  # JSON or comma-separated list (EMT, Paramedic, etc.)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ambulances = relationship("Ambulance", back_populates="driver")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="dispatcher")  # admin, dispatcher, driver
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Dispatch(Base):
    __tablename__ = "dispatch"
    
    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(Integer, ForeignKey("emergencies.id"), nullable=False)
    ambulance_id = Column(Integer, ForeignKey("ambulances.id"), nullable=False)
    hospital_name = Column(String(255))
    hospital_location = Column(String(500))
    hospital_latitude = Column(Float)
    hospital_longitude = Column(Float)
    distance_km = Column(Float)
    estimated_time_minutes = Column(Integer)
    whatsapp_status = Column(String(50), default="pending")  # pending, sent, delivered, failed
    route_polyline = Column(Text)  # Encoded polyline for route
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    emergency = relationship("Emergency", back_populates="dispatch")
    ambulance = relationship("Ambulance", back_populates="dispatch")
