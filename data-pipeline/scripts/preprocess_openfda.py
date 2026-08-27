from pathlib import Path
import zipfile
import json


BASE_DIR = Path(__file__).resolve().parent.parent

RAW_DIR = BASE_DIR / "raw" / "openfda"
OUTPUT_DIR = BASE_DIR / "processed" / "openfda"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

output_file = OUTPUT_DIR / "openfda_medicines.json"


# Fields we actually need for MediGuide
FIELDS = [
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


medicines = []

total_records = 0
valid_records = 0


zip_files = sorted(RAW_DIR.glob("*.zip"))

print(f"Found {len(zip_files)} ZIP files")


for zip_file in zip_files:

    print(f"\nProcessing: {zip_file.name}")

    with zipfile.ZipFile(zip_file, "r") as z:

        json_files = [
            name
            for name in z.namelist()
            if name.endswith(".json")
        ]

        if not json_files:
            print("No JSON file found")
            continue

        json_file = json_files[0]

        with z.open(json_file) as file:

            data = json.load(file)

        results = data.get("results", [])

        total_records += len(results)

        for record in results:

            openfda = record.get("openfda", {})

            # We need an RxCUI to connect with RxNorm
            rxcui = openfda.get("rxcui", [])

            if not rxcui:
                continue

            medicine = {

                "rxcui": rxcui,

                "brand_name": openfda.get(
                    "brand_name", []
                ),

                "generic_name": openfda.get(
                    "generic_name", []
                ),

                "manufacturer_name": openfda.get(
                    "manufacturer_name", []
                ),

                "product_type": openfda.get(
                    "product_type", []
                ),

                "route": openfda.get(
                    "route", []
                ),

                "substance_name": openfda.get(
                    "substance_name", []
                ),

                "pharm_class_moa": openfda.get(
                    "pharm_class_moa", []
                ),

                "pharm_class_epc": openfda.get(
                    "pharm_class_epc", []
                ),

                "indications_and_usage":
                    record.get(
                        "indications_and_usage", []
                    ),

                "dosage_and_administration":
                    record.get(
                        "dosage_and_administration", []
                    ),

                "dosage_forms_and_strengths":
                    record.get(
                        "dosage_forms_and_strengths", []
                    ),

                "contraindications":
                    record.get(
                        "contraindications", []
                    ),

                "warnings_and_cautions":
                    record.get(
                        "warnings_and_cautions", []
                    ),

                "adverse_reactions":
                    record.get(
                        "adverse_reactions", []
                    ),

                "drug_interactions":
                    record.get(
                        "drug_interactions", []
                    ),

                "use_in_specific_populations":
                    record.get(
                        "use_in_specific_populations", []
                    ),

                "overdosage":
                    record.get(
                        "overdosage", []
                    ),

                "description":
                    record.get(
                        "description", []
                    ),

                "clinical_pharmacology":
                    record.get(
                        "clinical_pharmacology", []
                    ),

                "mechanism_of_action":
                    record.get(
                        "mechanism_of_action", []
                    ),

                "pharmacokinetics":
                    record.get(
                        "pharmacokinetics", []
                    ),

                "information_for_patients":
                    record.get(
                        "information_for_patients", []
                    ),

                "storage_and_handling":
                    record.get(
                        "storage_and_handling", []
                    ),

                "set_id": record.get(
                    "set_id"
                ),

                "effective_time": record.get(
                    "effective_time"
                )
            }

            medicines.append(medicine)

            valid_records += 1


print("\n" + "=" * 50)
print("PROCESSING COMPLETE")
print("=" * 50)

print(f"Total FDA records: {total_records}")
print(f"Records with RxCUI: {valid_records}")


with open(
    output_file,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        medicines,
        file,
        indent=2,
        ensure_ascii=False
    )


print(f"\nSaved to:")
print(output_file)

print(
    f"\nOutput records: {len(medicines)}"
)