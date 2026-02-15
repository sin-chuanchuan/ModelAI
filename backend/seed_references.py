import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.get_database()
references_collection = db.references

def seed():
    # Clear existing presets if any (optional, but keep for testing)
    # references_collection.delete_many({"type": "platform_preset"})
    
    presets = [
        {
            "type": "platform_preset",
            "url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            "is_public": True,
            "tags": ["summer", "fashion"],
            "created_at": datetime.utcnow()
        },
        {
            "type": "platform_preset",
            "url": "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?w=800&q=80",
            "is_public": True,
            "tags": ["urban", "look"],
            "created_at": datetime.utcnow()
        },
        {
            "type": "platform_preset",
            "url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
            "is_public": True,
            "tags": ["beach", "vibe"],
            "created_at": datetime.utcnow()
        },
        {
            "type": "platform_preset",
            "url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            "is_public": True,
            "tags": ["classic"],
            "created_at": datetime.utcnow()
        }
    ]
    
    for preset in presets:
        existing = references_collection.find_one({"url": preset["url"]})
        if not existing:
            references_collection.insert_one(preset)
            print(f"Inserted: {preset['url']}")
        else:
            print(f"Already exists: {preset['url']}")

if __name__ == "__main__":
    seed()
