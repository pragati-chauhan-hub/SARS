"""
Initialize database with demo users
"""
import sys
sys.path.insert(0, '.')

from app.database.database import Base, engine, SessionLocal
from app.models.emergency import User as UserModel, Emergency, Ambulance, Driver, Dispatch
from app.utils.auth import hash_password

def init_db():
    """Create all tables and seed demo data"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    db = SessionLocal()
    
    try:
        # Check if demo user exists
        demo_user = db.query(UserModel).filter(UserModel.username == "demo").first()
        
        if not demo_user:
            # Create demo user
            demo_user = UserModel(
                username="demo",
                email="demo@sars.local",
                full_name="Demo Dispatcher",
                hashed_password=hash_password("password123"),
                role="dispatcher",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            print("✓ Demo user created (username: demo, password: password123)")
        else:
            print("✓ Demo user already exists")
        
        # Check for admin user
        admin_user = db.query(UserModel).filter(UserModel.username == "admin").first()
        
        if not admin_user:
            # Create admin user
            admin_user = UserModel(
                username="admin",
                email="admin@sars.local",
                full_name="Admin User",
                hashed_password=hash_password("password123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("✓ Admin user created (username: admin, password: password123)")
        else:
            print("✓ Admin user already exists")
        
        # Check for driver user
        driver_user = db.query(UserModel).filter(UserModel.username == "driver").first()
        
        if not driver_user:
            # Create driver user
            driver_user = UserModel(
                username="driver",
                email="driver@sars.local",
                full_name="Driver User",
                hashed_password=hash_password("password123"),
                role="driver",
                is_active=True
            )
            db.add(driver_user)
            db.commit()
            print("✓ Driver user created (username: driver, password: password123)")
        else:
            print("✓ Driver user already exists")
        
        print("\n✅ Database initialized successfully!")
        print("\nAvailable test accounts:")
        print("  - Username: demo, Password: password123 (Dispatcher)")
        print("  - Username: admin, Password: password123 (Admin)")
        print("  - Username: driver, Password: password123 (Driver)")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
