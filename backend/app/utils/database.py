from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")

# Create MongoDB client
client = MongoClient(MONGODB_URI)

# Get database
db = client.get_database()

# Get collections
users_collection = db.users
materials_collection = db.materials
generation_tasks_collection = db.generation_tasks

# Close client on exit
import atexit
atexit.register(client.close)