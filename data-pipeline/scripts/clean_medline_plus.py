import os
import re
from pathlib import Path

from pymongo import MongoClient
from dotenv import load_dotenv


# ============================================================
# PATH SETUP
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ENV = PROJECT_ROOT / "backend" / ".env"

print("Loading .env from:")
print(BACKEND_ENV)

load_dotenv(BACKEND_ENV)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found")


# ============================================================
# MONGODB CONNECTION
# ============================================================

print("\nConnecting to MongoDB...")

client = MongoClient(MONGO_URI)

db = client["mediguide"]

collection = db["medicines_enriched"]

client.admin.command("ping")

print("Connected successfully.")


# ============================================================
# HTML CLEANING FUNCTION
# ============================================================

def clean_html(text):

    if not text:
        return text

    # Convert common HTML block elements to line breaks
    text = re.sub(
        r"</(p|div|h1|h2|h3|h4|h5|h6|li)>",
        "\n",
        text,
        flags=re.IGNORECASE
    )

    # Convert list opening tags
    text = re.sub(
        r"<li[^>]*>",
        "\n• ",
        text,
        flags=re.IGNORECASE
    )

    # Remove all remaining HTML tags
    text = re.sub(
        r"<[^>]+>",
        "",
        text
    )

    # Decode common HTML entities
    html_entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&nbsp;": " "
    }

    for entity, replacement in html_entities.items():
        text = text.replace(entity, replacement)

    # Remove excessive whitespace
    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    # Remove excessive blank lines
    text = re.sub(
        r"\n\s*\n+",
        "\n\n",
        text
    )

    return text.strip()


# ============================================================
# CLEAN MEDLINEPLUS DATA
# ============================================================

print("\nStarting MedlinePlus cleaning...\n")

total = collection.count_documents({
    "medlineplus": {
        "$ne": None
    }
})

print(f"Medicines with MedlinePlus data: {total}")

processed = 0
updated = 0
errors = 0


# ============================================================
# PROCESS MEDICINES
# ============================================================

medicines = collection.find({
    "medlineplus": {
        "$ne": None
    }
})


for medicine in medicines:

    processed += 1

    try:

        medlineplus = medicine.get("medlineplus")

        if not medlineplus:
            continue

        entries = medlineplus.get("entries", [])

        cleaned_entries = []

        for entry in entries:

            cleaned_entry = {
                "title": entry.get("title"),
                "summary": clean_html(
                    entry.get("summary")
                ),
                "url": entry.get("url")
            }

            cleaned_entries.append(cleaned_entry)


        cleaned_medlineplus = {
            "source": "MedlinePlus",
            "entries": cleaned_entries
        }


        collection.update_one(
            {
                "_id": medicine["_id"]
            },
            {
                "$set": {
                    "medlineplus": cleaned_medlineplus
                }
            }
        )

        updated += 1

        if processed % 100 == 0:
            print(
                f"Processed: {processed}/{total}"
            )


    except Exception as e:

        errors += 1

        print(
            f"Error processing "
            f"{medicine.get('name')}: {e}"
        )


# ============================================================
# SUMMARY
# ============================================================

print("\n============================================================")
print("MEDLINEPLUS CLEANING COMPLETE")
print("============================================================")

print(f"Processed: {processed}")
print(f"Updated: {updated}")
print(f"Errors: {errors}")

print("============================================================")


# ============================================================
# CLOSE CONNECTION
# ============================================================

client.close()

print("\nMongoDB connection closed.")