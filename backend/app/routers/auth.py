"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.database import get_db
from app.models.emergency import User as UserModel
from app.schemas.emergency import UserCreate, UserResponse, LoginRequest, TokenResponse
from app.utils.auth import hash_password, verify_password, create_access_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(UserModel).filter(
        (UserModel.username == user.username) | (UserModel.email == user.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Create new user
    db_user = UserModel(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hash_password(user.password),
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"Registered new user: {db_user.username}")
    return db_user


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user and return JWT token - accepts both username and email"""
    # Try to find user by username or email
    user = db.query(UserModel).filter(
        or_(
            UserModel.username == credentials.username,
            UserModel.email == credentials.username
        )
    ).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
    
    logger.info(f"User logged in: {user.username}")
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.post("/logout")
async def logout():
    """Logout user (token is invalidated on client side)"""
    return {"message": "Logged out successfully"}
