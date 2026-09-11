from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["mediguide"]

# Collections
medicines_collection = db["medicines_enriched"]
icd10_collection = db["icd10_conditions"]
users_collection = db["users"]
reminders_collection = db["reminders"]
chat_sessions_collection = db["chat_sessions"]
chat_messages_collection = db["chat_messages"]

chat_sessions_collection.create_index(
    [("user_id", 1), ("updated_at", -1)]
)

chat_messages_collection.create_index(
    [("session_id", 1), ("timestamp", 1)]
)