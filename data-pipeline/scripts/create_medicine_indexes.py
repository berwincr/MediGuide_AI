from pathlib import Path
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import os


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_FILE = (
    BASE_DIR.parent
    / "backend"
    / ".env"
)


# --------------------------------------------------
# LOAD ENVIRONMENT
# --------------------------------------------------

load_dotenv(
    dotenv_path=ENV_FILE
)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        f"MONGO_URI not found in: {ENV_FILE}"
    )


# --------------------------------------------------
# CONNECT
# --------------------------------------------------

print("Connecting to MongoDB...")

client = MongoClient(MONGO_URI)

db = client["mediguide"]

collection = db["medicines_enriched"]


# --------------------------------------------------
# CREATE INDEXES
# --------------------------------------------------

print("Creating indexes...")


# Fast lookup by RxCUI
collection.create_index(
    [("rx_cui", ASCENDING)],
    unique=True,
    name="rx_cui_unique"
)


# Faster exact/general lookup by name
collection.create_index(
    [("name", ASCENDING)],
    name="name_index"
)


# --------------------------------------------------
# SHOW INDEXES
# --------------------------------------------------

print("\nIndexes created:")

for index in collection.list_indexes():

    print(
        index["name"],
        "→",
        index["key"]
    )


print("\nIndex creation complete.")

client.close()