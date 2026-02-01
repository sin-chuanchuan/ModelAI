import asyncio
from app.utils.database import materials_collection
from app.models.material import MaterialModel, MaterialType
from datetime import datetime

# Sample Data (Using Doubao example URLs for reliability)
PRESET_MODELS = [
    {"name": "Asian Female 1", "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "gender": "female"},
    {"name": "Asian Male 1", "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_2.png", "gender": "male"},
]

PRESET_SCENES = [
    {"name": "Studio White", "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png"},
]

async def seed():
    print("Seeding database...")
    
    # Models
    for m in PRESET_MODELS:
        if not materials_collection.find_one({"type": MaterialType.MODEL, "name": m["name"]}):
            mat = MaterialModel(
                type=MaterialType.MODEL,
                name=m["name"],
                url=m["url"],
                is_public=True,
                gender=m["gender"],
                created_at=datetime.utcnow()
            )
            materials_collection.insert_one(mat.model_dump(by_alias=True, exclude={"id"}))
            print(f"Inserted Model: {m['name']}")
            
    # Scenes
    for s in PRESET_SCENES:
        if not materials_collection.find_one({"type": MaterialType.SCENE, "name": s["name"]}):
            mat = MaterialModel(
                type=MaterialType.SCENE,
                name=s["name"],
                url=s["url"],
                is_public=True,
                created_at=datetime.utcnow()
            )
            materials_collection.insert_one(mat.model_dump(by_alias=True, exclude={"id"}))
            print(f"Inserted Scene: {s['name']}")
            
    print("Seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed())
