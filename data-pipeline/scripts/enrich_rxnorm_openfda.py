from pathlib import Path
import json


# --------------------------------------------------
# PATHS
# --------------------------------------------------

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
    / "medicines_enriched.json"
)


# --------------------------------------------------
# LOAD RXNORM
# --------------------------------------------------

print("Loading RxNorm...")

with open(
    RXNORM_FILE,
    "r",
    encoding="utf-8"
) as file:

    rxnorm_data = json.load(file)


print(
    f"RxNorm records: {len(rxnorm_data)}"
)


# --------------------------------------------------
# LOAD OPENFDA
# --------------------------------------------------

print("\nLoading openFDA...")

with open(
    OPENFDA_FILE,
    "r",
    encoding="utf-8"
) as file:

    openfda_data = json.load(file)


print(
    f"openFDA records: {len(openfda_data)}"
)


# --------------------------------------------------
# BUILD OPENFDA LOOKUP BY RXCUI
# --------------------------------------------------

print("\nBuilding openFDA RxCUI lookup...")

openfda_lookup = {}


for record in openfda_data:

    rxcuis = record.get(
        "rxcui",
        []
    )

    for rxcui in rxcuis:

        if rxcui not in openfda_lookup:

            openfda_lookup[rxcui] = []

        openfda_lookup[rxcui].append(record)


print(
    f"Unique openFDA RxCUIs: "
    f"{len(openfda_lookup)}"
)


# --------------------------------------------------
# ENRICH RXNORM
# --------------------------------------------------

print("\nEnriching RxNorm records...")

enriched = []

matched = 0
unmatched = 0


for rxnorm in rxnorm_data:

    rx_cui = rxnorm.get(
        "rx_cui"
    )

    # Start with the original RxNorm information
    medicine = {

        "rx_cui": rx_cui,

        "name": rxnorm.get(
            "name"
        ),

        "term_type": rxnorm.get(
            "term_type"
        ),

        "source": [
            "RxNorm"
        ]
    }


    # Find matching FDA records
    fda_records = openfda_lookup.get(
        rx_cui,
        []
    )


    if fda_records:

        matched += 1

        # --------------------------------------------------
        # COLLECT UNIQUE VALUES
        # --------------------------------------------------

        brand_names = set()
        generic_names = set()
        manufacturers = set()
        routes = set()
        substances = set()
        pharmacological_classes = set()

        indications = []
        dosage = []
        contraindications = []
        warnings = []
        adverse_reactions = []
        interactions = []
        patient_information = []
        overdosage = []
        storage = []


        for fda in fda_records:

            # -----------------------------
            # OPENFDA IDENTIFIERS
            # -----------------------------

            for value in fda.get(
                "brand_name",
                []
            ):
                brand_names.add(value)


            for value in fda.get(
                "generic_name",
                []
            ):
                generic_names.add(value)


            for value in fda.get(
                "manufacturer_name",
                []
            ):
                manufacturers.add(value)


            for value in fda.get(
                "route",
                []
            ):
                routes.add(value)


            for value in fda.get(
                "substance_name",
                []
            ):
                substances.add(value)


            for value in fda.get(
                "pharm_class_epc",
                []
            ):
                pharmacological_classes.add(value)


            for value in fda.get(
                "pharm_class_moa",
                []
            ):
                pharmacological_classes.add(value)


            # -----------------------------
            # MEDICAL INFORMATION
            # -----------------------------

            for value in fda.get(
                "indications_and_usage",
                []
            ):
                if value not in indications:
                    indications.append(value)


            for value in fda.get(
                "dosage_and_administration",
                []
            ):
                if value not in dosage:
                    dosage.append(value)


            for value in fda.get(
                "contraindications",
                []
            ):
                if value not in contraindications:
                    contraindications.append(value)


            for value in fda.get(
                "warnings_and_cautions",
                []
            ):
                if value not in warnings:
                    warnings.append(value)


            for value in fda.get(
                "adverse_reactions",
                []
            ):
                if value not in adverse_reactions:
                    adverse_reactions.append(value)


            for value in fda.get(
                "drug_interactions",
                []
            ):
                if value not in interactions:
                    interactions.append(value)


            for value in fda.get(
                "information_for_patients",
                []
            ):
                if value not in patient_information:
                    patient_information.append(value)


            for value in fda.get(
                "overdosage",
                []
            ):
                if value not in overdosage:
                    overdosage.append(value)


            for value in fda.get(
                "storage_and_handling",
                []
            ):
                if value not in storage:
                    storage.append(value)


        # --------------------------------------------------
        # ADD FDA DATA
        # --------------------------------------------------

        medicine["openfda"] = {

            "brand_names": sorted(
                brand_names
            ),

            "generic_names": sorted(
                generic_names
            ),

            "manufacturers": sorted(
                manufacturers
            ),

            "routes": sorted(
                routes
            ),

            "substances": sorted(
                substances
            ),

            "pharmacological_classes":
                sorted(
                    pharmacological_classes
                )
        }


        medicine["medical_information"] = {

            "indications_and_usage":
                indications,

            "dosage_and_administration":
                dosage,

            "contraindications":
                contraindications,

            "warnings_and_cautions":
                warnings,

            "adverse_reactions":
                adverse_reactions,

            "drug_interactions":
                interactions,

            "information_for_patients":
                patient_information,

            "overdosage":
                overdosage,

            "storage_and_handling":
                storage
        }


        medicine["source"].append(
            "openFDA"
        )


    else:

        unmatched += 1


    enriched.append(
        medicine
    )


# --------------------------------------------------
# SAVE
# --------------------------------------------------

print("\nSaving enriched dataset...")

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        enriched,
        file,
        indent=2,
        ensure_ascii=False
    )


# --------------------------------------------------
# SUMMARY
# --------------------------------------------------

print("\n" + "=" * 60)
print("ENRICHMENT COMPLETE")
print("=" * 60)

print(
    f"RxNorm records: {len(rxnorm_data)}"
)

print(
    f"Matched with openFDA: {matched}"
)

print(
    f"Not matched: {unmatched}"
)

print(
    f"Output records: {len(enriched)}"
)

print("\nSaved to:")

print(OUTPUT_FILE)