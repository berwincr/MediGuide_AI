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

OUTPUT_DIR = (
    BASE_DIR
    / "processed"
    / "final"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

OUTPUT_FILE = (
    OUTPUT_DIR
    / "mediguide_medicines.json"
)


# --------------------------------------------------
# NORMALIZATION
# --------------------------------------------------

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


# --------------------------------------------------
# HELPER
# --------------------------------------------------

def add_unique(target, values):

    for value in values:

        if value and value not in target:

            target.append(value)


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

print("Loading RxNorm...")

with open(
    RXNORM_FILE,
    "r",
    encoding="utf-8"
) as file:

    rxnorm = json.load(file)


print(
    f"RxNorm records: {len(rxnorm)}"
)


print("\nLoading openFDA...")

with open(
    OPENFDA_FILE,
    "r",
    encoding="utf-8"
) as file:

    openfda = json.load(file)


print(
    f"openFDA records: {len(openfda)}"
)


# --------------------------------------------------
# BUILD OPENFDA NAME LOOKUP
# --------------------------------------------------

print("\nBuilding openFDA lookup...")

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

            openfda_lookup[normalized] = []

        openfda_lookup[normalized].append(
            record
        )


print(
    f"Unique normalized FDA names: "
    f"{len(openfda_lookup)}"
)


# --------------------------------------------------
# BUILD FINAL DATASET
# --------------------------------------------------

final_medicines = []

matched = 0
unmatched = 0


for index, rx in enumerate(rxnorm):

    if index % 1000 == 0:

        print(
            f"Processing {index}/{len(rxnorm)}"
        )


    rx_cui = rx.get(
        "rx_cui"
    )

    name = rx.get(
        "name"
    )

    term_type = rx.get(
        "term_type"
    )


    medicine = {

        "rx_cui": rx_cui,

        "name": name,

        "term_type": term_type,

        "source": [
            "RxNorm"
        ]
    }


    # ------------------------------------------
    # Only enrich ingredient terms
    # ------------------------------------------

    if term_type != "IN":

        final_medicines.append(
            medicine
        )

        continue


    normalized_name = normalize(
        name
    )


    fda_records = openfda_lookup.get(
        normalized_name,
        []
    )


    if not fda_records:

        unmatched += 1

        final_medicines.append(
            medicine
        )

        continue


    matched += 1


    # ------------------------------------------
    # Select representative FDA record
    #
    # Prefer records containing the most
    # useful educational information.
    # ------------------------------------------

    def information_score(record):

        fields = [
            "indications_and_usage",
            "dosage_and_administration",
            "contraindications",
            "warnings_and_cautions",
            "adverse_reactions",
            "drug_interactions",
            "information_for_patients"
        ]

        score = 0

        for field in fields:

            values = record.get(
                field,
                []
            )

            if values:

                score += len(
                    " ".join(values)
                )

        return score


    representative = max(
        fda_records,
        key=information_score
    )


    # ------------------------------------------
    # FDA identity
    # ------------------------------------------

    brand_names = []

    generic_names = []

    manufacturers = []

    routes = []

    substances = []

    classes = []


    add_unique(
        brand_names,
        representative.get(
            "brand_name",
            []
        )
    )

    add_unique(
        generic_names,
        representative.get(
            "generic_name",
            []
        )
    )

    add_unique(
        manufacturers,
        representative.get(
            "manufacturer_name",
            []
        )
    )

    add_unique(
        routes,
        representative.get(
            "route",
            []
        )
    )

    add_unique(
        substances,
        representative.get(
            "substance_name",
            []
        )
    )

    add_unique(
        classes,
        representative.get(
            "pharm_class_epc",
            []
        )
    )

    add_unique(
        classes,
        representative.get(
            "pharm_class_moa",
            []
        )
    )


    medicine["source"].append(
        "openFDA"
    )


    medicine["openfda"] = {

        "brand_names": brand_names,

        "generic_names": generic_names,

        "manufacturers": manufacturers,

        "routes": routes,

        "substances": substances,

        "pharmacological_classes": classes
    }


    # ------------------------------------------
    # Medical information
    # ------------------------------------------

    medicine["medical_information"] = {

        "indications_and_usage":
            representative.get(
                "indications_and_usage",
                []
            ),

        "dosage_and_administration":
            representative.get(
                "dosage_and_administration",
                []
            ),

        "contraindications":
            representative.get(
                "contraindications",
                []
            ),

        "warnings_and_cautions":
            representative.get(
                "warnings_and_cautions",
                []
            ),

        "adverse_reactions":
            representative.get(
                "adverse_reactions",
                []
            ),

        "drug_interactions":
            representative.get(
                "drug_interactions",
                []
            ),

        "information_for_patients":
            representative.get(
                "information_for_patients",
                []
            ),

        "overdosage":
            representative.get(
                "overdosage",
                []
            ),

        "storage_and_handling":
            representative.get(
                "storage_and_handling",
                []
            )
    }


    final_medicines.append(
        medicine
    )


# --------------------------------------------------
# SAVE
# --------------------------------------------------

print("\nSaving final dataset...")


with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        final_medicines,
        file,
        ensure_ascii=False,
        indent=2
    )


# --------------------------------------------------
# SUMMARY
# --------------------------------------------------

print("\n" + "=" * 60)

print("FINAL MEDIGUIDE DATASET")

print("=" * 60)

print(
    f"RxNorm records: {len(rxnorm)}"
)

print(
    f"Matched with openFDA: {matched}"
)

print(
    f"Unmatched: {unmatched}"
)

print(
    f"Final records: {len(final_medicines)}"
)

print("\nSaved to:")

print(OUTPUT_FILE)