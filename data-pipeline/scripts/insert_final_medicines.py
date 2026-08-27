from pathlib import Path
import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR
    / "processed"
    / "final"
    / "mediguide_medicines.json"
)


# --------------------------------------------------
# LOAD ENVIRONMENT
# --------------------------------------------------

ENV_FILE = BASE_DIR.parent / "backend" / ".env"

print("Looking for .env at:")
print(ENV_FILE)

load_dotenv(dotenv_path=ENV_FILE)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        f"MONGO_URI not found in: {ENV_FILE}"
    )

# --------------------------------------------------
# CONNECT TO MONGODB
# --------------------------------------------------

print("Connecting to MongoDB Atlas...")

client = MongoClient(MONGO_URI)

db = client["mediguide"]

collection = db["medicines_enriched"]


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

print("Loading final dataset...")

with open(
    DATA_FILE,
    "r",
    encoding="utf-8"
) as file:

    medicines = json.load(file)


print(
    f"Loaded {len(medicines)} medicines"
)


# --------------------------------------------------
# PREVENT ACCIDENTAL DUPLICATES
# --------------------------------------------------

existing_count = collection.count_documents({})

print(
    f"Existing documents in medicines_enriched: "
    f"{existing_count}"
)


if existing_count > 0:

    print(
        "\nCollection already contains data."
    )

    print(
        "Aborting to prevent duplicate insertion."
    )

    client.close()

    exit()


# --------------------------------------------------
# INSERT IN BATCHES
# --------------------------------------------------

BATCH_SIZE = 500

total_inserted = 0


for start in range(
    0,
    len(medicines),
    BATCH_SIZE
):

    batch = medicines[
        start:start + BATCH_SIZE
    ]

    result = collection.insert_many(
        batch
    )

    total_inserted += len(
        result.inserted_ids
    )

    print(
        f"Inserted "
        f"{total_inserted}/"
        f"{len(medicines)}"
    )


# --------------------------------------------------
# VERIFY
# --------------------------------------------------

final_count = collection.count_documents({})


print("\n" + "=" * 60)
print("INSERTION COMPLETE")
print("=" * 60)

print(
    "Documents inserted:",
    total_inserted
)

print(
    "Documents in collection:",
    final_count
)


# --------------------------------------------------
# SAMPLE
# --------------------------------------------------

sample = collection.find_one(
    {
        "name": "acetaminophen"
    },
    {
        "_id": 0
    }
)


if sample:

    print("\nAcetaminophen found successfully.")

    print(
        "RxCUI:",
        sample.get("rx_cui")
    )

    print(
        "Sources:",
        sample.get("source")
    )


client.close()