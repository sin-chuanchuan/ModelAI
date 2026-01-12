from typing import Dict, Any, Optional, Type
from dotenv import load_dotenv
import os
from app.services.content_safety.base import ContentSafetyService
from app.services.content_safety.basic import BasicContentSafetyService

# Load environment variables
load_dotenv()

class ContentSafetyServiceFactory:
    """Factory class for creating content safety service instances."""
    
    # Service registry mapping service names to service classes
    _service_registry: Dict[str, Type[ContentSafetyService]] = {
        "basic": BasicContentSafetyService,
        # Add other content safety services here as they are implemented
        # "tencent_cloud": TencentCloudContentSafetyService,
        # "aliyun": AliyunContentSafetyService,
    }
    
    # Service instances cache
    _services: Dict[str, ContentSafetyService] = {}
    
    # Default service name from environment variables
    _default_service = os.getenv("DEFAULT_CONTENT_SAFETY_SERVICE", "basic")
    
    @classmethod
    def register_service(cls, service_name: str, service_class: Type[ContentSafetyService]) -> None:
        """
        Register a new content safety service class with the factory.
        
        Args:
            service_name: The name of the content safety service.
            service_class: The content safety service class to register.
        """
        cls._service_registry[service_name] = service_class
        # Clear cache if service was already registered
        if service_name in cls._services:
            del cls._services[service_name]
    
    @classmethod
    def get_service(cls, service_name: Optional[str] = None) -> ContentSafetyService:
        """
        Get an instance of the specified content safety service.
        
        Args:
            service_name: The name of the content safety service to get. If None, uses the default service from configuration.
        
        Returns:
            An instance of the specified content safety service.
        
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
    def _create_service(cls, service_name: str) -> ContentSafetyService:
        """
        Create a new instance of the specified content safety service.
        
        Args:
            service_name: The name of the content safety service to create.
        
        Returns:
            A new instance of the specified content safety service.
        
        Raises:
            ValueError: If the specified service name is not supported.
        """
        # Get service class from registry
        service_class = cls._service_registry.get(service_name)
        if not service_class:
            raise ValueError(f"Unsupported content safety service: {service_name}")
        
        # Create and return service instance
        return service_class()
    
    @classmethod
    def list_services(cls) -> Dict[str, str]:
        """
        List all available content safety services.
        
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
        Get the default content safety service name from configuration.
        
        Returns:
            The default service name.
        """
        return cls._default_service