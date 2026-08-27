import json
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent

file_path = (
    BASE_DIR
    / "processed"
    / "rxnorm"
    / "rxnorm_medicines.json"
)

with open(file_path, "r", encoding="utf-8") as file:
    medicines = json.load(file)

print("Total records:", len(medicines))

term_types = Counter(
    medicine["term_type"]
    for medicine in medicines
)

print("\nTerm type counts:")
for term_type, count in term_types.items():
    print(f"{term_type}: {count}")

print("\nFirst 5 records:")
for medicine in medicines[:5]:
    print(medicine)