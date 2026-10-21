import os
import glob
import csv

from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv


# --------------------------------------------------
# Paths
# --------------------------------------------------

# data-pipeline/
pipeline_root = os.path.dirname(
    os.path.dirname(__file__)
)

# MediGuide_AI/
project_root = os.path.dirname(
    pipeline_root
)


# --------------------------------------------------
# Load backend .env
# --------------------------------------------------

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


# --------------------------------------------------
# Connect to MongoDB
# --------------------------------------------------

client = MongoClient(MONGO_URI)

db = client["mediguide"]

collection = db["drug_interactions"]


# --------------------------------------------------
# Create unique index
# --------------------------------------------------

collection.create_index(
    "interaction_id",
    unique=True
)


# --------------------------------------------------
# DDInter raw data folder
# --------------------------------------------------

ddinter_folder = os.path.join(
    pipeline_root,
    "raw",
    "ddinter"
)


csv_files = sorted(
    glob.glob(
        os.path.join(
            ddinter_folder,
            "ddinter_downloads_code_*.csv"
        )
    )
)


print(
    f"Found {len(csv_files)} DDInter files"
)


if not csv_files:
    raise FileNotFoundError(
        f"No DDInter CSV files found in: "
        f"{ddinter_folder}"
    )


# --------------------------------------------------
# Import DDInter files
# --------------------------------------------------

total_processed = 0
total_inserted = 0
total_updated = 0


for csv_file in csv_files:

    filename = os.path.basename(csv_file)

    print(
        f"\nProcessing: {filename}"
    )

    operations = []

    with open(
        csv_file,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:

            ddinter_id_a = (
                row["DDInterID_A"].strip()
            )

            drug_a = (
                row["Drug_A"].strip()
            )

            ddinter_id_b = (
                row["DDInterID_B"].strip()
            )

            drug_b = (
                row["Drug_B"].strip()
            )

            level = (
                row["Level"].strip()
            )

            interaction_id = (
                ddinter_id_a
                + "_"
                + ddinter_id_b
            )

            document = {
                "interaction_id": interaction_id,
                "ddinter_id_a": ddinter_id_a,
                "drug_a": drug_a,
                "ddinter_id_b": ddinter_id_b,
                "drug_b": drug_b,
                "level": level
            }

            operations.append(
                UpdateOne(
                    {
                        "interaction_id": interaction_id
                    },
                    {
                        "$set": document
                    },
                    upsert=True
                )
            )

            total_processed += 1


    # --------------------------------------------------
    # Write to MongoDB
    # --------------------------------------------------

    if operations:

        result = collection.bulk_write(
            operations,
            ordered=False
        )

        total_inserted += (
            result.upserted_count
        )

        total_updated += (
            result.modified_count
        )

        print(
            f"Processed: {len(operations)}"
        )

        print(
            f"Inserted: {result.upserted_count}"
        )

        print(
            f"Updated: {result.modified_count}"
        )


# --------------------------------------------------
# Final summary
# --------------------------------------------------

print(
    "\nDDInter import completed."
)

print(
    f"Total rows processed: {total_processed}"
)

print(
    f"New records inserted: {total_inserted}"
)

print(
    f"Existing records updated: {total_updated}"
)

print(
    "Total documents in collection:",
    collection.count_documents({})
)