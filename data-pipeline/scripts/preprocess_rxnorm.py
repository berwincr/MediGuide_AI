from pathlib import Path
import csv
import json


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    BASE_DIR
    / "raw"
    / "rxnorm"
    / "RxNorm_full_prescribe_08032026"
    / "rrf"
    / "RXNCONSO.RRF"
)

OUTPUT_DIR = BASE_DIR / "processed" / "rxnorm"

OUTPUT_FILE = OUTPUT_DIR / "rxnorm_medicines.json"


# --------------------------------------------------
# CREATE OUTPUT DIRECTORY
# --------------------------------------------------

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# RXNCONSO COLUMN INDEXES
# --------------------------------------------------

RXCUI = 0
LAT = 1
SAB = 11
TTY = 12
STR = 14


# --------------------------------------------------
# PROCESS FILE
# --------------------------------------------------

medicines = []

seen = set()

with open(INPUT_FILE, "r", encoding="utf-8") as file:

    reader = csv.reader(file, delimiter="|")

    for row in reader:

        # Safety check
        if len(row) < 19:
            continue

        rxcui = row[RXCUI].strip()
        language = row[LAT].strip()
        source = row[SAB].strip()
        term_type = row[TTY].strip()
        name = row[STR].strip()

        # --------------------------------------------------
        # FILTERS
        # --------------------------------------------------

        # English only
        if language != "ENG":
            continue

        # Only RxNorm source
        if source != "RXNORM":
            continue

        # Keep ingredient and branded-name terms
        if term_type not in {"IN", "BN"}:
            continue

        # Ignore empty names
        if not name:
            continue

        # Avoid duplicate records
        key = (rxcui, name.lower(), term_type)

        if key in seen:
            continue

        seen.add(key)

        medicines.append({
            "rx_cui": rxcui,
            "name": name,
            "term_type": term_type,
            "source": source
        })


# --------------------------------------------------
# SAVE JSON
# --------------------------------------------------

with open(OUTPUT_FILE, "w", encoding="utf-8") as file:

    json.dump(
        medicines,
        file,
        indent=2,
        ensure_ascii=False
    )


# --------------------------------------------------
# SUMMARY
# --------------------------------------------------

print("RxNorm preprocessing completed.")
print(f"Input file : {INPUT_FILE}")
print(f"Output file: {OUTPUT_FILE}")
print(f"Medicines extracted: {len(medicines)}")