from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parent.parent

RXNORM_FILE = (
    BASE_DIR
    / "processed"
    / "rxnorm"
    / "rxnorm_medicines.json"
)

OPENFDA_FILE = (
    BASE_DIR
    / "processed"
    / "openfda"
    / "openfda_medicines.json"
)


# -----------------------------
# Load files
# -----------------------------

with open(RXNORM_FILE, "r", encoding="utf-8") as file:
    rxnorm = json.load(file)

with open(OPENFDA_FILE, "r", encoding="utf-8") as file:
    openfda = json.load(file)


# -----------------------------
# RxNorm values
# -----------------------------

rxnorm_ids = set()

for record in rxnorm:
    value = record.get("rx_cui")

    if value is not None:
        rxnorm_ids.add(str(value).strip())


# -----------------------------
# openFDA values
# -----------------------------

openfda_ids = set()

for record in openfda:

    for value in record.get("rxcui", []):

        openfda_ids.add(
            str(value).strip()
        )


# -----------------------------
# Compare
# -----------------------------

matches = rxnorm_ids.intersection(
    openfda_ids
)


print("=" * 60)
print("RxCUI MATCHING DIAGNOSTIC")
print("=" * 60)

print(
    "Unique RxNorm RxCUIs:",
    len(rxnorm_ids)
)

print(
    "Unique openFDA RxCUIs:",
    len(openfda_ids)
)

print(
    "Matching RxCUIs:",
    len(matches)
)


# -----------------------------
# Examples
# -----------------------------

print("\nFirst 20 RxNorm RxCUIs:")

for value in list(rxnorm_ids)[:20]:
    print(repr(value))


print("\nFirst 20 openFDA RxCUIs:")

for value in list(openfda_ids)[:20]:
    print(repr(value))


print("\nKnown example: 161")

print(
    "161 in RxNorm:",
    "161" in rxnorm_ids
)

print(
    "161 in openFDA:",
    "161" in openfda_ids
)