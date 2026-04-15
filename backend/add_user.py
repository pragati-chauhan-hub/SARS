"""
Quick script to add demo user to database
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.emergency import User as UserModel
from app.utils.auth import hash_password

def add_demo_user():
    db = SessionLocal()
    try:
        # Check if user exists
        user = db.query(UserModel).filter(UserModel.username == "demo").first()
        
        if user:
            print("✓ Demo user already exists")
        else:
            # Create demo user
            demo = UserModel(
                username="demo",
                email="demo@sars.local",
                full_name="Demo User",
                hashed_password=hash_password("password123"),
                role="dispatcher",
                is_active=True
            )
            db.add(demo)
            db.commit()
            print("✓ Demo user created!")
            print("  Username: demo")
            print("  Password: password123")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_demo_user()
