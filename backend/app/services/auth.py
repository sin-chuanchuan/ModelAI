from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime
from bson import ObjectId

from app.utils.database import users_collection
from app.utils.password import get_password_hash, verify_password
from app.schemas.user import UserCreate, UserInDB
from app.utils.jwt import create_access_token

def create_user(user_data: UserCreate) -> UserInDB:
    """Create a new user."""
    # Check if email already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "email": user_data.email,
        "company_name": user_data.company_name,
        "contact_name": user_data.contact_name,
        "phone": user_data.phone,
        "hashed_password": hashed_password,
        "is_active": True,
        "is_admin": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user into database
    result = users_collection.insert_one(user_doc)
    
    # Get the created user
    created_user = users_collection.find_one({"_id": result.inserted_id})
    
    # Convert to UserInDB schema
    return UserInDB(
        id=str(created_user["_id"]),
        email=created_user["email"],
        company_name=created_user["company_name"],
        contact_name=created_user["contact_name"],
        phone=created_user["phone"],
        is_active=created_user["is_active"],
        is_admin=created_user["is_admin"],
        created_at=created_user["created_at"],
        updated_at=created_user["updated_at"]
    )

def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    """Authenticate a user."""
    user = users_collection.find_one({"email": email})
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    
    return UserInDB(
        id=str(user["_id"]),
        email=user["email"],
        company_name=user["company_name"],
        contact_name=user["contact_name"],
        phone=user["phone"],
        is_active=user["is_active"],
        is_admin=user["is_admin"],
        created_at=user["created_at"],
        updated_at=user["updated_at"]
    )

def create_user_token(user: UserInDB) -> str:
    """Create an access token for a user."""
    access_token = create_access_token(
        data={"sub": user.id}
    )
    return access_token