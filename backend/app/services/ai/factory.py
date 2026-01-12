from typing import Dict, Any, Optional, Type
from dotenv import load_dotenv
import os
from app.services.ai.base import AIService
from app.services.ai.openai_service import OpenAIService
from app.services.ai.doubao_service import DoubaoAIService

# Load environment variables
load_dotenv()

class AIServiceFactory:
    """Factory class for creating AI service instances with support for configuration and dynamic loading."""
    
    # Service registry mapping service names to service classes
    _service_registry: Dict[str, Type[AIService]] = {
        "openai": OpenAIService,
        "doubao": DoubaoAIService,
        # Add other AI services here as they are implemented
        # "replicate": ReplicateService,
        # "custom": CustomAIService,
    }
    
    # Service instances cache
    _services: Dict[str, AIService] = {}
    
    # Default service name from environment variables
    _default_service = os.getenv("DEFAULT_AI_SERVICE", "openai")
    
    @classmethod
    def register_service(cls, service_name: str, service_class: Type[AIService]) -> None:
        """
        Register a new AI service class with the factory.
        
        Args:
            service_name: The name of the AI service.
            service_class: The AI service class to register.
        """
        cls._service_registry[service_name] = service_class
        # Clear cache if service was already registered
        if service_name in cls._services:
            del cls._services[service_name]
    
    @classmethod
    def get_service(cls, service_name: Optional[str] = None) -> AIService:
        """
        Get an instance of the specified AI service.
        
        Args:
            service_name: The name of the AI service to get. If None, uses the default service from configuration.
        
        Returns:
            An instance of the specified AI service.
        
        Raises:
            ValueError: If the specified service name is not supported.
        """
        # Use default service if no name is provided
        if service_name is None:
            service_name = cls._default_service
        
        # Create and cache service instance if not already exists
        if service_name not in cls._services:
            cls._services[service_name] = cls._create_service(service_name)
        
        return cls._services[service_name]
    
    @classmethod
    def _create_service(cls, service_name: str) -> AIService:
        """
        Create a new instance of the specified AI service.
        
        Args:
            service_name: The name of the AI service to create.
        
        Returns:
            A new instance of the specified AI service.
        
        Raises:
            ValueError: If the specified service name is not supported.
        """
        # Get service class from registry
        service_class = cls._service_registry.get(service_name)
        if not service_class:
            raise ValueError(f"Unsupported AI service: {service_name}")
        
        # Create and return service instance
        return service_class()
    
    @classmethod
    def list_services(cls) -> Dict[str, str]:
        """
        List all available AI services.
        
        Returns:
            A dictionary mapping service names to their class names.
        """
        return {
            service_name: service_class.__name__
            for service_name, service_class in cls._service_registry.items()
        }
    
    @classmethod
    def get_default_service_name(cls) -> str:
        """
        Get the default AI service name from configuration.
        
        Returns:
            The default service name.
        """
        return cls._default_service