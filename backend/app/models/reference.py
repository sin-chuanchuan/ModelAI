from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class ReferenceType(str, Enum):
    USER_HISTORY = "user_history"  # User's historical photo
    PLATFORM_PRESET = "platform_preset" # Platform provided high-quality reference

class ReferencePhotoModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    url: str = Field(..., description="Image URL")
    type: ReferenceType = Field(..., description="Type of reference photo")
    
    # Metadata for better matching
    tags: List[str] = Field(default=[], description="Style tags e.g. 'street', 'studio', 'nature'")
    gender: Optional[str] = Field(None, description="Model gender if applicable")
    
    # Ownership
    owner_id: Optional[PyObjectId] = Field(None, description="User ID if private, None if platform preset")
    is_public: bool = Field(default=False, description="Visible to all users")
    
    # Original image metadata for lighting/pose reconstruction
    original_metadata: Optional[Dict[str, Any]] = Field(default={}, description="Technical metadata")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
