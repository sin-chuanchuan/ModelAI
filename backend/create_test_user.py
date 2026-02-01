import asyncio
from app.utils.database import users_collection
from app.utils.password import get_password_hash
from app.models.user import UserModel
from datetime import datetime

async def create_test_user():
    phone = "13800138000"
    password = "password123"
    
    existing = users_collection.find_one({"phone": phone})
    if existing:
        print(f"User {phone} already exists.")
        # Optional: reset password if needed, but for now just report existence
        return

    hashed_password = get_password_hash(password)
    
    user = {
        "phone": phone,
        "hashed_password": hashed_password,
        "company_name": "ModelAI Test Corp",
        "contact_name": "Test User",
        "is_active": True,
        "is_superuser": False,
        "balance": 1000,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    print(f"Created user: {phone} with password: {password}")

if __name__ == "__main__":
    asyncio.run(create_test_user())
