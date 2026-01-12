from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime

class TrainingDataPair(BaseModel):
    """Model for training data pairs (flat lay image + model image)."""
    id: str = Field(..., description="Unique identifier for the data pair")
    user_id: Optional[str] = Field(None, description="ID of the user who contributed the data")
    flat_lay_image_url: str = Field(..., description="URL of the flat lay product image")
    model_image_url: str = Field(..., description="URL of the model wearing the product")
    product_type: str = Field(..., description="Type of product (e.g., dress, shirt, pants)")
    category: str = Field(..., description="Category of the product (e.g., clothing, accessories)")
    tags: List[str] = Field(default_factory=list, description="Tags for the data pair")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation time")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update time")
    is_valid: bool = Field(default=True, description="Whether the data pair is valid for training")

class TrainingDataPairCreate(BaseModel):
    """Model for creating a new training data pair."""
    flat_lay_image_url: str
    model_image_url: str
    product_type: str
    category: str
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class TrainingDataPairUpdate(BaseModel):
    """Model for updating an existing training data pair."""
    product_type: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    is_valid: Optional[bool] = None