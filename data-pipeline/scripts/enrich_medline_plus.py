import os
import time
import requests
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

client = MongoClient(
    MONGO_URI,
    retryWrites=True,
    retryReads=True,
    serverSelectionTimeoutMS=60000,
    connectTimeoutMS=60000,
    socketTimeoutMS=120000
)

db = client["mediguide"]

collection = db["medicines_enriched"]

# Test connection
client.admin.command("ping")

print("Connected successfully.")


# ============================================================
# MEDLINEPLUS FUNCTION
# ============================================================

def get_medlineplus_data(rx_cui, medicine_name):

    url = (
        "https://connect.medlineplus.gov/service"
        f"?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88"
        f"&mainSearchCriteria.v.c={rx_cui}"
        "&informationRecipient.languageCode.c=en"
        "&knowledgeResponseType=application/json"
    )

    try:

        response = requests.get(
            url,
            timeout=20
        )

        if response.status_code != 200:
            return None

        data = response.json()

        feed = data.get("feed", {})

        entries = feed.get("entry", [])

        if not entries:
            return None

        parsed_entries = []

        for entry in entries:

            title = (
                entry.get("title", {})
                .get("_value")
            )

            summary = (
                entry.get("summary", {})
                .get("_value")
            )

            links = entry.get("link", [])

            medicine_url = None

            if links:
                medicine_url = links[0].get("href")

            parsed_entries.append({
                "title": title,
                "summary": summary,
                "url": medicine_url
            })

        return {
            "source": "MedlinePlus",
            "entries": parsed_entries
        }

    except Exception as e:

        print(
            f"  Error for {medicine_name}: {e}"
        )

        return None


# ============================================================
# SAFE MONGODB UPDATE FUNCTION
# ============================================================

def update_medicine(medicine_id, medlineplus_data):

    for attempt in range(3):

        try:

            collection.update_one(
                {"_id": medicine_id},
                {
                    "$set": {
                        "medlineplus": medlineplus_data
                    }
                }
            )

            return True

        except Exception as e:

            print(
                f"  MongoDB update failed "
                f"(attempt {attempt + 1}/3): {e}"
            )

            if attempt < 2:

                print("  Retrying in 2 seconds...")

                time.sleep(2)

    print("  ✗ MongoDB update failed after 3 attempts")

    return False


# ============================================================
# GET MEDICINES
# ============================================================

total = collection.count_documents({})

print(f"\nTotal medicines: {total}")


# Only medicines that have NOT been processed yet
medicines = collection.find(
    {
        "medlineplus": {
            "$exists": False
        }
    },
    batch_size=10
)

processed = 0
matched = 0
no_match = 0
errors = 0


# ============================================================
# ENRICH DATA
# ============================================================

print("\nStarting MedlinePlus enrichment...\n")


for medicine in medicines:

    processed += 1

    rx_cui = medicine.get("rx_cui")

    name = medicine.get("name")


    # --------------------------------------------------------
    # MEDICINE WITHOUT RXCUI
    # --------------------------------------------------------

    if not rx_cui:

        success = update_medicine(
            medicine["_id"],
            None
        )

        if success:

            no_match += 1

        else:

            errors += 1

        continue


    print(
        f"[{processed}] {name} | RxCUI: {rx_cui}"
    )


    # --------------------------------------------------------
    # GET MEDLINEPLUS DATA
    # --------------------------------------------------------

    result = get_medlineplus_data(
        rx_cui,
        name
    )


    # --------------------------------------------------------
    # MATCH FOUND
    # --------------------------------------------------------

    if result:

        success = update_medicine(
            medicine["_id"],
            result
        )

        if success:

            matched += 1

            print(
                f"  ✓ Found "
                f"{len(result['entries'])} result(s)"
            )

        else:

            errors += 1


    # --------------------------------------------------------
    # NO MATCH
    # --------------------------------------------------------

    else:

        success = update_medicine(
            medicine["_id"],
            None
        )

        if success:

            no_match += 1

            print("  - No result")

        else:

            errors += 1


    # --------------------------------------------------------
    # AVOID SENDING REQUESTS TOO QUICKLY
    # --------------------------------------------------------

    time.sleep(0.2)


# ============================================================
# SUMMARY
# ============================================================

print("\n============================================================")
print("MEDLINEPLUS ENRICHMENT COMPLETE")
print("============================================================")

print(f"Processed: {processed}")
print(f"Matched: {matched}")
print(f"No match: {no_match}")
print(f"Errors: {errors}")

print("============================================================")


# ============================================================
# CLOSE MONGODB CONNECTION
# ============================================================

client.close()

print("\nMongoDB connection closed.")