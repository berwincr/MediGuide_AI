import json
import time
from pathlib import Path

import requests


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    BASE_DIR
    / "processed"
    / "final"
    / "mediguide_medicines.json"
)


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

TEST_LIMIT = 20
DELAY_SECONDS = 1

MEDLINEPLUS_URL = (
    "https://connect.medlineplus.gov/service"
)


# --------------------------------------------------
# LOAD MEDICINES
# --------------------------------------------------

print("Loading medicines...")

with open(
    INPUT_FILE,
    "r",
    encoding="utf-8"
) as file:

    medicines = json.load(file)


# Use only ingredient medicines for the first test
ingredients = [
    medicine
    for medicine in medicines
    if medicine.get("term_type") == "IN"
]

test_medicines = ingredients[:TEST_LIMIT]

print(
    f"Testing {len(test_medicines)} medicines"
)


# --------------------------------------------------
# SESSION
# --------------------------------------------------

session = requests.Session()

results = []
matched = 0
not_matched = 0
errors = 0


# --------------------------------------------------
# FETCH FUNCTION
# --------------------------------------------------

def get_medlineplus(rx_cui, name):

    params = {
        "mainSearchCriteria.v.c": rx_cui,
        "mainSearchCriteria.v.cs":
            "2.16.840.1.113883.6.88",
        "mainSearchCriteria.v.dn": name,
        "knowledgeResponseType":
            "application/json",
        "informationRecipient.languageCode.c":
            "en"
    }

    response = session.get(
        MEDLINEPLUS_URL,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    feed = data.get("feed", {})

    entries = feed.get("entry", [])

    parsed_entries = []

    for entry in entries:

        title = (
            entry
            .get("title", {})
            .get("_value")
        )

        summary = (
            entry
            .get("summary", {})
            .get("_value")
        )

        updated = (
            entry
            .get("updated", {})
            .get("_value")
        )

        links = entry.get(
            "link",
            []
        )

        url = None

        if links:
            url = links[0].get("href")

        parsed_entries.append({
            "title": title,
            "summary": summary,
            "url": url,
            "updated": updated
        })

    return parsed_entries


# --------------------------------------------------
# PROCESS MEDICINES
# --------------------------------------------------

print("\nStarting MedlinePlus batch test...\n")

for index, medicine in enumerate(
    test_medicines,
    start=1
):

    rx_cui = medicine.get("rx_cui")
    name = medicine.get("name")

    print(
        f"[{index}/{len(test_medicines)}] "
        f"{name} | RxCUI: {rx_cui}"
    )

    try:

        entries = get_medlineplus(
            rx_cui,
            name
        )

        if entries:

            matched += 1

            print(
                f"  ✓ Found {len(entries)} result(s)"
            )

        else:

            not_matched += 1

            print(
                "  - No MedlinePlus result"
            )

        results.append({
            "rx_cui": rx_cui,
            "name": name,
            "medlineplus_entries": entries
        })

    except Exception as error:

        errors += 1

        print(
            f"  ✗ Error: {error}"
        )

    # Be polite to the public API
    if index < len(test_medicines):
        time.sleep(DELAY_SECONDS)


# --------------------------------------------------
# SUMMARY
# --------------------------------------------------

print("\n" + "=" * 60)
print("MEDLINEPLUS BATCH TEST COMPLETE")
print("=" * 60)

print(f"Total tested: {len(test_medicines)}")
print(f"Matched: {matched}")
print(f"No match: {not_matched}")
print(f"Errors: {errors}")

print("\nSample results:")

for result in results[:5]:

    print(
        f"\n{result['name']} "
        f"({result['rx_cui']})"
    )

    print(
        f"Results: "
        f"{len(result['medlineplus_entries'])}"
    )