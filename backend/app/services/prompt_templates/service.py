from typing import Dict, Any, List, Optional
from datetime import datetime
from bson import ObjectId
from app.models.prompt_template import PromptTemplate, PromptTemplateCreate, PromptTemplateUpdate
from app.utils.database import db

# Get the prompt templates collection
prompt_templates_collection = db.prompt_templates

class PromptTemplateService:
    """Service for managing prompt templates."""
    
    @staticmethod
    def create_template(template_data: PromptTemplateCreate) -> PromptTemplate:
        """
        Create a new prompt template.
        
        Args:
            template_data: The data for the new template.
        
        Returns:
            The created prompt template.
        """
        # Convert to dictionary and add metadata
        template_doc = template_data.model_dump()
        template_doc.update({
            "_id": str(ObjectId()),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        })
        
        # Insert into database
        prompt_templates_collection.insert_one(template_doc)
        
        # Return the created template
        return PromptTemplate(**template_doc)
    
    @staticmethod
    def get_template(template_id: str) -> Optional[PromptTemplate]:
        """
        Get a prompt template by ID.
        
        Args:
            template_id: The ID of the template to get.
        
        Returns:
            The prompt template if found, None otherwise.
        """
        template_doc = prompt_templates_collection.find_one({"_id": template_id})
        if template_doc:
            return PromptTemplate(**template_doc)
        return None
    
    @staticmethod
    def get_all_templates(category: Optional[str] = None, tags: Optional[List[str]] = None) -> List[PromptTemplate]:
        """
        Get all prompt templates, optionally filtered by category or tags.
        
        Args:
            category: Optional category to filter by.
            tags: Optional list of tags to filter by.
        
        Returns:
            A list of prompt templates.
        """
        query = {"is_active": True}
        
        if category:
            query["category"] = category
        
        if tags:
            query["tags"] = {"$in": tags}
        
        templates = []
        for template_doc in prompt_templates_collection.find(query):
            templates.append(PromptTemplate(**template_doc))
        
        return templates
    
    @staticmethod
    def update_template(template_id: str, template_data: PromptTemplateUpdate) -> Optional[PromptTemplate]:
        """
        Update a prompt template.
        
        Args:
            template_id: The ID of the template to update.
            template_data: The data to update the template with.
        
        Returns:
            The updated prompt template if found, None otherwise.
        """
        # Prepare update data
        update_data = template_data.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = prompt_templates_collection.update_one(
            {"_id": template_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return None
        
        # Return the updated template
        return PromptTemplateService.get_template(template_id)
    
    @staticmethod
    def delete_template(template_id: str) -> bool:
        """
        Delete a prompt template.
        
        Args:
            template_id: The ID of the template to delete.
        
        Returns:
            True if the template was deleted, False otherwise.
        """
        result = prompt_templates_collection.delete_one({"_id": template_id})
        return result.deleted_count > 0
    
    @staticmethod
    def generate_prompt(template: PromptTemplate, variables: Dict[str, Any]) -> str:
        """
        Generate a prompt from a template by filling in variables.
        
        Args:
            template: The prompt template to use.
            variables: The variables to fill into the template.
        
        Returns:
            The generated prompt string.
        """
        # Use Python's format method to fill in the template
        # This will raise KeyError if any required variables are missing
        return template.template.format(**variables)
    
    @staticmethod
    def get_template_categories() -> List[str]:
        """
        Get all distinct template categories.
        
        Returns:
            A list of distinct category names.
        """
        return prompt_templates_collection.distinct("category")
    
    @staticmethod
    def get_template_tags() -> List[str]:
        """
        Get all distinct template tags.
        
        Returns:
            A list of distinct tag names.
        """
        return prompt_templates_collection.distinct("tags")