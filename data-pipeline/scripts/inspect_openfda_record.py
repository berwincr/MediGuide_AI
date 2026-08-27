from pathlib import Path
import zipfile
import json


BASE_DIR = Path(__file__).resolve().parent.parent

zip_file = (
    BASE_DIR
    / "raw"
    / "openfda"
    / "drug-label-0001-of-0014.json.zip"
)


with zipfile.ZipFile(zip_file, "r") as z:

    json_file = "drug-label-0001-of-0014.json"

    with z.open(json_file) as file:
        data = json.load(file)


record = data["results"][0]


print("=" * 60)
print("OPENFDA IDENTIFIERS")
print("=" * 60)

openfda = record.get("openfda", {})

for key, value in openfda.items():
    print(f"\n{key}:")
    print(value)


print("\n" + "=" * 60)
print("IMPORTANT MEDICINE INFORMATION")
print("=" * 60)

fields = [
    "indications_and_usage",
    "dosage_and_administration",
    "dosage_forms_and_strengths",
    "contraindications",
    "warnings_and_cautions",
    "adverse_reactions",
    "drug_interactions",
    "use_in_specific_populations",
    "overdosage",
    "description",
    "clinical_pharmacology",
    "mechanism_of_action",
    "pharmacokinetics",
    "information_for_patients",
    "storage_and_handling"
]


for field in fields:

    value = record.get(field)

    print(f"\n--- {field} ---")

    if value:
        if isinstance(value, list):
            print(value[0][:1000])
        else:
            print(str(value)[:1000])
    else:
        print("NOT AVAILABLE")