import json
import os
import re
import zipfile
import xml.etree.ElementTree as ET


# --------------------------------------------------
# Paths
# --------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

ZIP_PATH = os.path.join(
    SCRIPT_DIR,
    "..",
    "raw",
    "icd10",
    "icd10cm-April-1-2026-XML.zip"
)

OUTPUT_PATH = os.path.join(
    SCRIPT_DIR,
    "..",
    "processed",
    "icd10_conditions.json"
)

XML_NAME = "icd10c-tabular-April-1-2026.xml"


# --------------------------------------------------
# Helpers
# --------------------------------------------------

def clean_chapter(text):
    text = (text or "").strip()

    return re.sub(
        r"\s*\([A-Z0-9]+(?:-[A-Z0-9]+)?\)\s*$",
        "",
        text
    )


def clean_description(text):
    text = (text or "").strip()
    return re.sub(r"\s+", " ", text)


# --------------------------------------------------
# 1. Check source ZIP
# --------------------------------------------------

if not os.path.exists(ZIP_PATH):
    raise FileNotFoundError(
        f"Official ICD-10-CM ZIP not found:\n{ZIP_PATH}"
    )


print("=" * 60)
print("ICD-10-CM FY2026 PREPROCESSING")
print("=" * 60)

print("\nSource ZIP:")
print(ZIP_PATH)


# --------------------------------------------------
# 2. Extract official Tabular XML
# --------------------------------------------------

with zipfile.ZipFile(ZIP_PATH, "r") as zip_file:

    if XML_NAME not in zip_file.namelist():
        raise FileNotFoundError(
            f"{XML_NAME} not found inside ZIP."
        )

    xml_bytes = zip_file.read(XML_NAME)


print("\nOfficial XML extracted:")
print(XML_NAME)


# --------------------------------------------------
# 3. Parse XML
# --------------------------------------------------

root = ET.fromstring(xml_bytes)

records_by_code = {}


# --------------------------------------------------
# 4. Extract ICD-10-CM diagnosis codes
# --------------------------------------------------

for chapter in root.findall("./chapter"):

    chapter_name = clean_chapter(
        chapter.findtext("desc")
    )

    for diag in chapter.iter("diag"):

        code = (
            diag.findtext("name") or ""
        ).strip()

        description = (
            diag.findtext("desc") or ""
        ).strip()

        if not code or not description:
            continue

        description = clean_description(
            description
        )

        records_by_code.setdefault(
            code,
            {
                "code": code,
                "description": description,
                "chapter": chapter_name,
                "source": "ICD-10-CM"
            }
        )


# --------------------------------------------------
# 5. Remove duplicate codes
# --------------------------------------------------

records = list(
    records_by_code.values()
)

records.sort(
    key=lambda record: record["code"]
)


# --------------------------------------------------
# 6. Create output directory
# --------------------------------------------------

os.makedirs(
    os.path.dirname(OUTPUT_PATH),
    exist_ok=True
)


# --------------------------------------------------
# 7. Save processed JSON
# --------------------------------------------------

with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        records,
        file,
        indent=2,
        ensure_ascii=False
    )


# --------------------------------------------------
# 8. Validation
# --------------------------------------------------

required_fields = [
    "code",
    "description",
    "chapter",
    "source"
]

valid_records = [
    record
    for record in records
    if all(
        field in record
        for field in required_fields
    )
]


# --------------------------------------------------
# 9. Verify important searches
# --------------------------------------------------

migraine = [
    record
    for record in records
    if "migraine" in record["description"].lower()
]

asthma = [
    record
    for record in records
    if "asthma" in record["description"].lower()
]


# --------------------------------------------------
# 10. Print results
# --------------------------------------------------

print("\n" + "=" * 60)
print("PREPROCESSING COMPLETE")
print("=" * 60)

print("Total records:", len(records))
print("Valid records:", len(valid_records))

print("\nMigraine records:", len(migraine))

if migraine:
    for record in migraine[:5]:
        print(
            record["code"],
            "-",
            record["description"]
        )

print("\nAsthma records:", len(asthma))

if asthma:
    for record in asthma[:5]:
        print(
            record["code"],
            "-",
            record["description"]
        )

print("\nOutput:")
print(OUTPUT_PATH)

print("=" * 60)
