from app.utils.database import client, db

def test_db_connection():
    print("Testing MongoDB connection...")
    try:
        # Test connection by pinging the server
        client.admin.command('ping')
        print("✓ MongoDB connection successful!")
        
        # Print database name
        print(f"✓ Database name: {db.name}")
        
        # Print collection names
        collections = db.list_collection_names()
        print(f"✓ Collections: {collections}")
        
        return True
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        return False

if __name__ == "__main__":
    test_db_connection()