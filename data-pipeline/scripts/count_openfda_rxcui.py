from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parent.parent

input_file = (
    BASE_DIR
    / "processed"
    / "openfda"
    / "openfda_medicines.json"
)


with open(input_file, "r", encoding="utf-8") as file:
    medicines = json.load(file)


unique_rxcuis = set()

for medicine in medicines:

    for rxcui in medicine.get("rxcui", []):

        unique_rxcuis.add(rxcui)


print("Total processed FDA records:", len(medicines))

print(
    "Unique RxCUIs:",
    len(unique_rxcuis)
)

print(
    "Average FDA records per RxCUI:",
    round(
        len(medicines) / len(unique_rxcuis),
        2
    )
)