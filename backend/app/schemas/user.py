from pydantic import BaseModel,  Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    phone: str = Field(..., description="Phone number")
    company_name: Optional[str] = None
    contact_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_name: Optional[str] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    id: str
    is_active: bool
    is_superuser: bool = False
    balance: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserInDB):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None