from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime
from bson import ObjectId

from app.utils.database import users_collection
from app.utils.password import get_password_hash, verify_password
from app.schemas.user import UserCreate, UserInDB
from app.models.user import UserModel
from app.utils.jwt import create_access_token

def create_user(user_data: UserCreate) -> UserInDB:
    """Create a new user."""
    # Check if phone already exists
    existing_user = users_collection.find_one({"phone": user_data.phone})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user model instance
    user_model = UserModel(
        phone=user_data.phone,
        hashed_password=hashed_password,
        company_name=user_data.company_name,
        contact_name=user_data.contact_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Insert user into database
    user_doc = user_model.model_dump(by_alias=True, exclude={"id"})
    result = users_collection.insert_one(user_doc)
    
    # Return schema
    return UserInDB(
        id=str(result.inserted_id),
        phone=user_model.phone,
        company_name=user_model.company_name,
        contact_name=user_model.contact_name,
        is_active=user_model.is_active,
        is_superuser=user_model.is_superuser,
        balance=user_model.balance,
        created_at=user_model.created_at,
        updated_at=user_model.updated_at
    )

def authenticate_user(phone: str, password: str) -> Optional[UserInDB]:
    """Authenticate a user."""
    user = users_collection.find_one({"phone": phone})
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    
    # Use model_validate for cleaner mapping if needed, but manual is fine for InDB schema
    return UserInDB(
        id=str(user["_id"]),
        phone=user["phone"],
        company_name=user.get("company_name"),
        contact_name=user.get("contact_name"),
        is_active=user.get("is_active", True),
        is_superuser=user.get("is_superuser", False),
        balance=user.get("balance", 0),
        created_at=user.get("created_at", datetime.utcnow()),
        updated_at=user.get("updated_at", datetime.utcnow())
    )

def create_user_token(user: UserInDB) -> str:
    """Create an access token for a user."""
    access_token = create_access_token(
        data={"sub": user.id}
    )
    return access_token