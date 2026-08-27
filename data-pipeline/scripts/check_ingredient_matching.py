from pathlib import Path
import json
import re


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


def normalize(text):
    text = str(text).lower().strip()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# -----------------------------------------
# Load RxNorm
# -----------------------------------------

with open(
    RXNORM_FILE,
    "r",
    encoding="utf-8"
) as file:

    rxnorm = json.load(file)


# -----------------------------------------
# Load openFDA
# -----------------------------------------

with open(
    OPENFDA_FILE,
    "r",
    encoding="utf-8"
) as file:

    openfda = json.load(file)


# -----------------------------------------
# Build openFDA lookup
# -----------------------------------------

openfda_lookup = {}


for record in openfda:

    names = []

    names.extend(
        record.get(
            "generic_name",
            []
        )
    )

    names.extend(
        record.get(
            "substance_name",
            []
        )
    )

    for name in names:

        normalized = normalize(name)

        if not normalized:
            continue

        if normalized not in openfda_lookup:

            openfda_lookup[normalized] = 0

        openfda_lookup[normalized] += 1


# -----------------------------------------
# Check RxNorm IN terms
# -----------------------------------------

total_in = 0
matched_in = 0

examples = []


for record in rxnorm:

    if record.get("term_type") != "IN":
        continue

    total_in += 1

    name = record.get("name")

    if not name:
        continue

    normalized = normalize(name)

    if normalized in openfda_lookup:

        matched_in += 1

        if len(examples) < 30:

            examples.append(
                (
                    record.get("rx_cui"),
                    name,
                    openfda_lookup[normalized]
                )
            )


# -----------------------------------------
# Results
# -----------------------------------------

print("=" * 60)
print("RxNorm INGREDIENT → openFDA MATCHING")
print("=" * 60)

print(
    "RxNorm ingredient records:",
    total_in
)

print(
    "Matched ingredient records:",
    matched_in
)

print(
    "Unmatched ingredient records:",
    total_in - matched_in
)

print(
    "Match percentage:",
    round(
        matched_in / total_in * 100,
        2
    )
    if total_in
    else 0
)


print("\nExamples:")

for rxcui, name, count in examples:

    print(
        f"RxCUI {rxcui} | "
        f"{name} | "
        f"FDA records: {count}"
    )