from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class MaterialType(str, Enum):
    MODEL = "model"
    SCENE = "scene"
    POSE = "pose"
    GARMENT = "garment"

class MaterialModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    type: MaterialType = Field(..., description="Type of material")
    name: str = Field(..., description="Display name")
    url: str = Field(..., description="Image URL") # OSS URL
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail URL")
    
    # Metadata for specific types
    gender: Optional[str] = Field(None, description="For models: male/female/kid")
    tags: List[str] = Field(default=[], description="Search tags")
    
    # Ownership
    owner_id: Optional[PyObjectId] = Field(None, description="User ID if private, None if public preset")
    is_public: bool = Field(default=False, description="Visible to all users")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
