from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class GenerationTaskModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., description="User ID")
    
    # Inputs
    garment_url: str
    model_id: str  # Can be preset ID or user uploaded model ID (future)
    scene_id: str
    pose_id: Optional[str] = None
    prompt: Optional[str] = None # Auto-generated or custom
    
    # Outputs
    result_url: Optional[str] = None
    error_message: Optional[str] = None
    
    # Meta
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    progress: int = Field(default=0, ge=0, le=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
