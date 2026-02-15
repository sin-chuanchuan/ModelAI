from app.services.prompt_templates.service import PromptTemplateService
from app.models.prompt_template import PromptTemplateCreate

def initialize_prompt_templates():
    """
    Initialize the database with some default prompt templates.
    """
    print("Initializing prompt templates...")
    
    # Define default templates
    default_templates = [
        {
            "name": "电商模特-全身照",
            "description": "生成专业的电商模特全身照，适合服装展示",
            "template": "A professional e-commerce photo of a {gender} model wearing {clothing} against a {background} background. The model is standing full body, facing {facing_direction}, with clean studio lighting. High detail, realistic texture, commercial quality, {style}",
            "category": "fashion",
            "tags": ["full_body", "clothing", "studio"],
            "variables": [
                {"name": "gender", "type": "string", "description": "Model gender (male/female/neutral)", "required": True},
                {"name": "clothing", "type": "string", "description": "Description of the clothing", "required": True},
                {"name": "background", "type": "string", "description": "Background type (e.g., white, studio, outdoor)", "required": True},
                {"name": "facing_direction", "type": "string", "description": "Facing direction (front, side, 3/4)", "required": True},
                {"name": "style", "type": "string", "description": "Photography style (e.g., clean, vibrant, minimalist)", "required": True}
            ],
            "example": "A professional e-commerce photo of a female model wearing a red dress against a white background. The model is standing full body, facing front, with clean studio lighting. High detail, realistic texture, commercial quality, clean"
        },
        {
            "name": "电商模特-半身照",
            "description": "生成专业的电商模特半身照，适合上装展示",
            "template": "A high-quality e-commerce portrait of a {gender} model wearing {top_clothing} with {bottom_clothing} against a {background} background. The model is in {pose}, with {lighting} lighting. Sharp focus on the clothing, professional composition, {mood}, {style}",
            "category": "fashion",
            "tags": ["half_body", "top", "portrait"],
            "variables": [
                {"name": "gender", "type": "string", "description": "Model gender", "required": True},
                {"name": "top_clothing", "type": "string", "description": "Description of top clothing", "required": True},
                {"name": "bottom_clothing", "type": "string", "description": "Description of bottom clothing or accessories", "required": False},
                {"name": "background", "type": "string", "description": "Background type", "required": True},
                {"name": "pose", "type": "string", "description": "Model pose", "required": True},
                {"name": "lighting", "type": "string", "description": "Lighting style", "required": True},
                {"name": "mood", "type": "string", "description": "Photography mood", "required": True},
                {"name": "style", "type": "string", "description": "Photography style", "required": True}
            ],
            "example": "A high-quality e-commerce portrait of a male model wearing a casual shirt with jeans against a wooden background. The model is in a relaxed pose, with natural lighting. Sharp focus on the clothing, professional composition, casual, minimalist"
        },
        {
            "name": "电商产品-平铺图",
            "description": "生成专业的电商产品平铺图，适合服装和配饰展示",
            "template": "A professional product flat lay photo of {product} on a {background} background. The item is {arrangement}, with {lighting} lighting. Clean, minimalist composition, sharp focus, product photography style, {style}, {color_tone}",
            "category": "product",
            "tags": ["flat_lay", "product", "minimalist"],
            "variables": [
                {"name": "product", "type": "string", "description": "Product description", "required": True},
                {"name": "background", "type": "string", "description": "Background type", "required": True},
                {"name": "arrangement", "type": "string", "description": "Product arrangement", "required": True},
                {"name": "lighting", "type": "string", "description": "Lighting style", "required": True},
                {"name": "style", "type": "string", "description": "Photography style", "required": True},
                {"name": "color_tone", "type": "string", "description": "Color tone", "required": True}
            ],
            "example": "A professional product flat lay photo of a blue sweater on a white background. The item is neatly folded, with soft natural lighting. Clean, minimalist composition, sharp focus, product photography style, clean, warm"
        },
        {
            "name": "电商模特-配饰展示",
            "description": "生成专业的电商模特配饰展示照片",
            "template": "A professional e-commerce photo of a {gender} model wearing {accessory} with {outfit} against a {background} background. The focus is on the {accessory}, with {lighting} lighting. High detail, realistic, commercial quality, {style}",
            "category": "fashion",
            "tags": ["accessory", "detailed", "commercial"],
            "variables": [
                {"name": "gender", "type": "string", "description": "Model gender", "required": True},
                {"name": "accessory", "type": "string", "description": "Accessory description", "required": True},
                {"name": "outfit", "type": "string", "description": "Model outfit", "required": True},
                {"name": "background", "type": "string", "description": "Background type", "required": True},
                {"name": "lighting", "type": "string", "description": "Lighting style", "required": True},
                {"name": "style", "type": "string", "description": "Photography style", "required": True}
            ],
            "example": "A professional e-commerce photo of a female model wearing a statement necklace with a black dress against a dark background. The focus is on the necklace, with dramatic lighting. High detail, realistic, commercial quality, elegant"
        },
        {
            "name": "高保真虚拟换装",
            "description": "基于参考图和服装图，高保真还原模特并更换服装",
            "template": "将图片1中的模特穿上图片2中的服装。必须严格保持图片1中模特的面部特征、发型、五官和妆容，且背景环境保持完全一致。专业高端电商商拍图，高质量保真，细腻的织物纹理，柔和自然的商业摄影光影，8K超清，极致细节。",
            "category": "fashion",
            "tags": ["vto", "try_on", "high_fidelity"],
            "variables": [],
            "example": "将图片1中的模特穿上图片2中的服装。保持模特的面部特征不变，背景保持完全一致。专业商拍质感。"
        }
    ]
    
    # Create each template if it doesn't already exist
    created_count = 0
    for template_data in default_templates:
        # Check if template already exists by name
        existing_templates = PromptTemplateService.get_all_templates(category=template_data["category"])
        template_exists = any(t.name == template_data["name"] for t in existing_templates)
        
        if not template_exists:
            # Create the template
            template_create = PromptTemplateCreate(**template_data)
            PromptTemplateService.create_template(template_create)
            created_count += 1
            print(f"✓ Created template: {template_data['name']}")
        else:
            print(f"✓ Template already exists: {template_data['name']}")
    
    print(f"\nInitialization complete. Created {created_count} new templates.")

if __name__ == "__main__":
    initialize_prompt_templates()