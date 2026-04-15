from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables and create demo users"""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Create demo users
    from app.models.emergency import User as UserModel
    from app.utils.auth import hash_password
    
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin_user = db.query(UserModel).filter(UserModel.email == "admin@test.com").first()
        
        if not admin_user:
            # Create admin user
            admin_user = UserModel(
                username="admin",
                email="admin@test.com",
                full_name="Admin User",
                hashed_password=hash_password("password123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info("✓ Admin user created (email: admin@test.com, password: password123)")
        
        # Check if dispatcher user exists
        dispatcher_user = db.query(UserModel).filter(UserModel.email == "dispatcher@test.com").first()
        
        if not dispatcher_user:
            # Create dispatcher user
            dispatcher_user = UserModel(
                username="dispatcher",
                email="dispatcher@test.com",
                full_name="Dispatcher User",
                hashed_password=hash_password("password123"),
                role="dispatcher",
                is_active=True
            )
            db.add(dispatcher_user)
            db.commit()
            logger.info("✓ Dispatcher user created (email: dispatcher@test.com, password: password123)")
        
        # Check if driver user exists
        driver_user = db.query(UserModel).filter(UserModel.email == "driver@test.com").first()
        
        if not driver_user:
            # Create driver user
            driver_user = UserModel(
                username="driver",
                email="driver@test.com",
                full_name="Driver User",
                hashed_password=hash_password("password123"),
                role="driver",
                is_active=True
            )
            db.add(driver_user)
            db.commit()
            logger.info("✓ Driver user created (email: driver@test.com, password: password123)")
        
        logger.info("Database initialized successfully with demo users")
        
    except Exception as e:
        logger.error(f"Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()
