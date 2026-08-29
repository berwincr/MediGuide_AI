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
icd10_collection = db["icd10_conditions"]