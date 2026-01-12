from typing import Dict, Any, Optional, Type
from dotenv import load_dotenv
import os
from app.services.storage.base import StorageService
from app.services.storage.local import LocalStorageService

# Load environment variables
load_dotenv()

class StorageServiceFactory:
    """Factory class for creating storage service instances."""
    
    # Service registry mapping service names to service classes
    _service_registry: Dict[str, Type[StorageService]] = {
        "local": LocalStorageService,
        # Add other storage services here as they are implemented
        # "aws_s3": AWSS3StorageService,
        # "aliyun_oss": AliyunOSSStorageService,
    }
    
    # Service instances cache
    _services: Dict[str, StorageService] = {}
    
    # Default service name from environment variables
    _default_service = os.getenv("DEFAULT_STORAGE_SERVICE", "local")
    
    @classmethod
    def register_service(cls, service_name: str, service_class: Type[StorageService]) -> None:
        """
        Register a new storage service class with the factory.
        
        Args:
            service_name: The name of the storage service.
            service_class: The storage service class to register.
        """
        cls._service_registry[service_name] = service_class
        # Clear cache if service was already registered
        if service_name in cls._services:
            del cls._services[service_name]
    
    @classmethod
    def get_service(cls, service_name: Optional[str] = None, **kwargs) -> StorageService:
        """
        Get an instance of the specified storage service.
        
        Args:
            service_name: The name of the storage service to get. If None, uses the default service from configuration.
            **kwargs: Additional parameters to pass to the service constructor.
        
        Returns:
            An instance of the specified storage service.
        
        Raises:
            ValueError: If the specified service name is not supported.
        """
        # Use default service if no name is provided
        if service_name is None:
            service_name = cls._default_service
        
        # Create and cache service instance if not already exists or if kwargs are provided
        if service_name not in cls._services or kwargs:
            cls._services[service_name] = cls._create_service(service_name, **kwargs)
        
        return cls._services[service_name]
    
    @classmethod
    def _create_service(cls, service_name: str, **kwargs) -> StorageService:
        """
        Create a new instance of the specified storage service.
        
        Args:
            service_name: The name of the storage service to create.
            **kwargs: Additional parameters to pass to the service constructor.
        
        Returns:
            A new instance of the specified storage service.
        
        Raises:
            ValueError: If the specified service name is not supported.
        """
        # Get service class from registry
        service_class = cls._service_registry.get(service_name)
        if not service_class:
            raise ValueError(f"Unsupported storage service: {service_name}")
        
        # Create and return service instance
        return service_class(**kwargs)
    
    @classmethod
    def list_services(cls) -> Dict[str, str]:
        """
        List all available storage services.
        
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
        Get the default storage service name from configuration.
        
        Returns:
            The default service name.
        """
        return cls._default_service