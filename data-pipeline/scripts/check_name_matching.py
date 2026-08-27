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

    # Remove punctuation
    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    # Normalize spaces
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ----------------------------------------
# Load RxNorm
# ----------------------------------------

with open(
    RXNORM_FILE,
    "r",
    encoding="utf-8"
) as file:

    rxnorm = json.load(file)


# ----------------------------------------
# Load openFDA
# ----------------------------------------

with open(
    OPENFDA_FILE,
    "r",
    encoding="utf-8"
) as file:

    openfda = json.load(file)


# ----------------------------------------
# Build RxNorm name set
# ----------------------------------------

rxnorm_names = set()

for record in rxnorm:

    name = record.get("name")

    if name:
        rxnorm_names.add(
            normalize(name)
        )


# ----------------------------------------
# Build openFDA name set
# ----------------------------------------

openfda_names = set()

for record in openfda:

    for name in record.get(
        "generic_name",
        []
    ):

        openfda_names.add(
            normalize(name)
        )

    for name in record.get(
        "substance_name",
        []
    ):

        openfda_names.add(
            normalize(name)
        )


# ----------------------------------------
# Compare
# ----------------------------------------

matches = (
    rxnorm_names
    .intersection(openfda_names)
)


print("=" * 60)
print("NAME MATCHING DIAGNOSTIC")
print("=" * 60)

print(
    "Unique RxNorm names:",
    len(rxnorm_names)
)

print(
    "Unique openFDA names:",
    len(openfda_names)
)

print(
    "Exact matching names:",
    len(matches)
)


# ----------------------------------------
# Show examples
# ----------------------------------------

print("\nExample matching names:")

for name in list(matches)[:30]:

    print(name)