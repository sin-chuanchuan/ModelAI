from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class PromptTemplate(BaseModel):
    """Model for prompt templates."""
    id: str = Field(..., description="Unique identifier for the template")
    name: str = Field(..., description="Name of the template")
    description: str = Field(..., description="Description of the template")
    template: str = Field(..., description="The prompt template string with placeholders")
    category: str = Field(..., description="Category of the template (e.g., fashion, product)")
    tags: List[str] = Field(default_factory=list, description="Tags for the template")
    variables: List[Dict[str, Any]] = Field(default_factory=list, description="List of variables used in the template")
    example: Optional[str] = Field(None, description="Example of a filled template")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation time")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update time")
    is_active: bool = Field(default=True, description="Whether the template is active")

class Variable(BaseModel):
    """Model for template variables."""
    name: str = Field(..., description="Name of the variable")
    type: str = Field(..., description="Type of the variable (e.g., string, image_url)")
    description: str = Field(..., description="Description of the variable")
    default: Optional[Any] = Field(None, description="Default value for the variable")
    required: bool = Field(default=True, description="Whether the variable is required")

class PromptTemplateCreate(BaseModel):
    """Model for creating a new prompt template."""
    name: str
    description: str
    template: str
    category: str
    tags: List[str] = Field(default_factory=list)
    variables: List[Dict[str, Any]] = Field(default_factory=list)
    example: Optional[str] = None

class PromptTemplateUpdate(BaseModel):
    """Model for updating an existing prompt template."""
    name: Optional[str] = None
    description: Optional[str] = None
    template: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    variables: Optional[List[Dict[str, Any]]] = None
    example: Optional[str] = None
    is_active: Optional[bool] = None