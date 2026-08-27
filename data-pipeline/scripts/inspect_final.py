from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parent.parent

FILE = (
    BASE_DIR
    / "processed"
    / "final"
    / "mediguide_medicines.json"
)


with open(FILE, "r", encoding="utf-8") as file:
    medicines = json.load(file)


print("=" * 60)
print("FINAL MEDIGUIDE DATASET INSPECTION")
print("=" * 60)

print("Total medicines:", len(medicines))


# --------------------------------------------------
# Show first 5 records
# --------------------------------------------------

print("\nFIRST 5 RECORDS\n")

for medicine in medicines[:5]:

    print(json.dumps(
        medicine,
        indent=2,
        ensure_ascii=False
    ))

    print("-" * 60)


# --------------------------------------------------
# Find acetaminophen
# --------------------------------------------------

print("\nSEARCHING FOR ACETAMINOPHEN\n")

found = False

for medicine in medicines:

    name = str(
        medicine.get("name", "")
    ).lower()

    if name == "acetaminophen":

        print(
            json.dumps(
                medicine,
                indent=2,
                ensure_ascii=False
            )
        )

        found = True
        break


if not found:

    print(
        "Acetaminophen not found"
    )


# --------------------------------------------------
# Count enriched records
# --------------------------------------------------

rxnorm_only = 0
enriched = 0


for medicine in medicines:

    sources = medicine.get(
        "source",
        []
    )

    if "openFDA" in sources:

        enriched += 1

    else:

        rxnorm_only += 1


print("\n" + "=" * 60)

print("DATASET SUMMARY")

print("=" * 60)

print(
    "RxNorm + openFDA:",
    enriched
)

print(
    "RxNorm only:",
    rxnorm_only
)

print(
    "Total:",
    len(medicines)
)