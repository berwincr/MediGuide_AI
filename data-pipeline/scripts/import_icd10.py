import json
import os

from pymongo import MongoClient
from dotenv import load_dotenv


# --------------------------------------------------
# 1. Load environment variables
# --------------------------------------------------

ENV_PATH = r"C:\Users\BERWIN CR\OneDrive\Desktop\MediGuide_AI\backend\.env"

print("Loading .env from:")
print(ENV_PATH)

load_dotenv(ENV_PATH)


# --------------------------------------------------
# 2. Connect to MongoDB
# --------------------------------------------------

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in .env file")

print("\nConnecting to MongoDB...")

client = MongoClient(MONGO_URI)

db = client["mediguide"]

collection = db["icd10_conditions"]

print("Connected successfully.")


# --------------------------------------------------
# 3. Load ICD-10 JSON
# --------------------------------------------------

JSON_PATH = os.path.join(
    os.path.dirname(__file__),
    "icd10_conditions.json"
)

print("\nLoading ICD-10 data from:")
print(JSON_PATH)

with open(JSON_PATH, "r", encoding="utf-8") as file:
    icd10_data = json.load(file)

print("Records loaded:", len(icd10_data))


# --------------------------------------------------
# 4. Validate records
# --------------------------------------------------

print("\nValidating records...")

required_fields = ["code", "description", "chapter", "source"]

valid_records = []
invalid_records = []

for record in icd10_data:

    if all(field in record for field in required_fields):
        valid_records.append(record)
    else:
        invalid_records.append(record)


print("Valid records:", len(valid_records))
print("Invalid records:", len(invalid_records))


if invalid_records:
    print("\nInvalid records:")
    for record in invalid_records:
        print(record)


# --------------------------------------------------
# 5. Remove existing ICD-10 collection data
# --------------------------------------------------

print("\nClearing existing ICD-10 data...")

deleted = collection.delete_many({})

print("Deleted:", deleted.deleted_count)


# --------------------------------------------------
# 6. Insert ICD-10 records
# --------------------------------------------------

if valid_records:

    print("\nInserting ICD-10 records...")

    result = collection.insert_many(valid_records)

    print("Inserted:", len(result.inserted_ids))

else:
    print("No valid records to insert.")


# --------------------------------------------------
# 7. Create indexes
# --------------------------------------------------

print("\nCreating indexes...")

collection.create_index(
    "code",
    unique=True,
    name="code_unique"
)

collection.create_index(
    "description",
    name="description_index"
)

collection.create_index(
    "chapter",
    name="chapter_index"
)

print("Indexes created successfully.")


# --------------------------------------------------
# 8. Verify database
# --------------------------------------------------

print("\n" + "=" * 60)
print("ICD-10 IMPORT COMPLETE")
print("=" * 60)

print("Total documents:", collection.count_documents({}))

print("\nSample document:")

sample = collection.find_one(
    {},
    {"_id": 0}
)

print(sample)

print("=" * 60)


# --------------------------------------------------
# 9. Close connection
# --------------------------------------------------

client.close()

print("\nMongoDB connection closed.")