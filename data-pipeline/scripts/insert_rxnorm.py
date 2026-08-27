import json
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient


# ----------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ----------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / "backend" / ".env")

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found")


# ----------------------------------------
# MONGODB
# ----------------------------------------

client = MongoClient(MONGO_URI)

db = client["mediguide"]

# IMPORTANT: separate collection
collection = db["rxnorm_medicines"]


# ----------------------------------------
# LOAD PROCESSED JSON
# ----------------------------------------

PIPELINE_DIR = Path(__file__).resolve().parent.parent

file_path = (
    PIPELINE_DIR
    / "processed"
    / "rxnorm"
    / "rxnorm_medicines.json"
)

with open(file_path, "r", encoding="utf-8") as file:
    medicines = json.load(file)

print(f"Loaded {len(medicines)} medicines")


# ----------------------------------------
# INSERT
# ----------------------------------------

result = collection.insert_many(medicines)

print(f"Inserted {len(result.inserted_ids)} medicines")

print(
    "Total RxNorm documents:",
    collection.count_documents({})
)


client.close()

print("MongoDB connection closed")