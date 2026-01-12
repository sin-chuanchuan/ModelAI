from PIL import Image, ImageEnhance
from typing import Dict, Any, Optional
import io
import base64

def resize_image(image: Image.Image, size: tuple) -> Image.Image:
    """
    Resize an image to the specified size.
    
    Args:
        image: The input image.
        size: The target size as (width, height).
    
    Returns:
        The resized image.
    """
    return image.resize(size, Image.LANCZOS)

def crop_image(image: Image.Image, box: tuple) -> Image.Image:
    """
    Crop an image to the specified box.
    
    Args:
        image: The input image.
        box: The crop box as (left, upper, right, lower).
    
    Returns:
        The cropped image.
    """
    return image.crop(box)

def remove_background(image: Image.Image) -> Image.Image:
    """
    Remove the background from an image.
    
    Note: This is a basic implementation. For better results, consider using a dedicated
    background removal library like rembg.
    
    Args:
        image: The input image.
    
    Returns:
        The image with background removed.
    """
    # Convert to RGBA if not already
    image = image.convert("RGBA")
    
    # Get data
    data = image.getdata()
    
    # Create new data with transparent background
    new_data = []
    for item in data:
        # Change white and near-white pixels to transparent
        # This is a simple threshold approach
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    # Update image data
    image.putdata(new_data)
    
    return image

def adjust_brightness(image: Image.Image, factor: float) -> Image.Image:
    """
    Adjust the brightness of an image.
    
    Args:
        image: The input image.
        factor: The brightness factor (1.0 is original, <1.0 is darker, >1.0 is brighter).
    
    Returns:
        The brightness-adjusted image.
    """
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(factor)

def adjust_contrast(image: Image.Image, factor: float) -> Image.Image:
    """
    Adjust the contrast of an image.
    
    Args:
        image: The input image.
        factor: The contrast factor (1.0 is original, <1.0 is lower contrast, >1.0 is higher contrast).
    
    Returns:
        The contrast-adjusted image.
    """
    enhancer = ImageEnhance.Contrast(image)
    return enhancer.enhance(factor)

def adjust_saturation(image: Image.Image, factor: float) -> Image.Image:
    """
    Adjust the saturation of an image.
    
    Args:
        image: The input image.
        factor: The saturation factor (1.0 is original, 0.0 is grayscale, >1.0 is more saturated).
    
    Returns:
        The saturation-adjusted image.
    """
    enhancer = ImageEnhance.Color(image)
    return enhancer.enhance(factor)

def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    """
    Convert an image to a base64 string.
    
    Args:
        image: The input image.
        format: The image format (e.g., PNG, JPEG).
    
    Returns:
        The base64-encoded image string.
    """
    buffered = io.BytesIO()
    image.save(buffered, format=format)
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/{format.lower()};base64,{img_str}"

def base64_to_image(base64_str: str) -> Image.Image:
    """
    Convert a base64 string to an image.
    
    Args:
        base64_str: The base64-encoded image string.
    
    Returns:
        The decoded image.
    """
    # Remove data URL prefix if present
    if base64_str.startswith("data:image/"):
        base64_str = base64_str.split(",")[1]
    
    # Decode base64 string
    img_data = base64.b64decode(base64_str)
    
    # Create image from bytes
    return Image.open(io.BytesIO(img_data))

def preprocess_image(
    image: Image.Image,
    resize: Optional[tuple] = None,
    crop: Optional[tuple] = None,
    remove_bg: bool = False,
    brightness: Optional[float] = None,
    contrast: Optional[float] = None,
    saturation: Optional[float] = None
) -> Image.Image:
    """
    Preprocess an image with the specified operations.
    
    Args:
        image: The input image.
        resize: Optional target size as (width, height).
        crop: Optional crop box as (left, upper, right, lower).
        remove_bg: Whether to remove the background.
        brightness: Optional brightness factor.
        contrast: Optional contrast factor.
        saturation: Optional saturation factor.
    
    Returns:
        The preprocessed image.
    """
    result = image.copy()
    
    # Apply operations in order
    if crop:
        result = crop_image(result, crop)
    
    if resize:
        result = resize_image(result, resize)
    
    if remove_bg:
        result = remove_background(result)
    
    if brightness is not None:
        result = adjust_brightness(result, brightness)
    
    if contrast is not None:
        result = adjust_contrast(result, contrast)
    
    if saturation is not None:
        result = adjust_saturation(result, saturation)
    
    return result