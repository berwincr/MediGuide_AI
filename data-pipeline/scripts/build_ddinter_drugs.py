import os

from pymongo import MongoClient
from dotenv import load_dotenv


# Load backend .env
pipeline_root = os.path.dirname(
    os.path.dirname(__file__)
)

project_root = os.path.dirname(
    pipeline_root
)

load_dotenv(
    os.path.join(
        project_root,
        "backend",
        ".env"
    )
)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        "MONGO_URI not found in backend/.env"
    )


# Connect to MongoDB
client = MongoClient(MONGO_URI)

db = client["mediguide"]

interactions_collection = db[
    "drug_interactions"
]

drugs_collection = db[
    "ddinter_drugs"
]


# Process every interaction
cursor = interactions_collection.find(
    {},
    {
        "_id": 0,
        "ddinter_id_a": 1,
        "drug_a": 1,
        "ddinter_id_b": 1,
        "drug_b": 1
    }
)


drugs = {}


for document in cursor:

    ddinter_id_a = document["ddinter_id_a"]
    drug_a = document["drug_a"]

    ddinter_id_b = document["ddinter_id_b"]
    drug_b = document["drug_b"]

    drugs[ddinter_id_a] = drug_a
    drugs[ddinter_id_b] = drug_b


print(
    f"Found {len(drugs)} unique DDInter drugs"
)


# Rebuild the collection
drugs_collection.delete_many({})


documents = []

for ddinter_id, drug_name in drugs.items():

    documents.append(
        {
            "ddinter_id": ddinter_id,
            "drug_name": drug_name
        }
    )


if documents:
    drugs_collection.insert_many(
        documents
    )


# Create indexes
drugs_collection.create_index(
    "ddinter_id",
    unique=True
)

drugs_collection.create_index(
    "drug_name"
)


print(
    "DDInter drug mapping created successfully."
)

print(
    "Documents:",
    drugs_collection.count_documents({})
)