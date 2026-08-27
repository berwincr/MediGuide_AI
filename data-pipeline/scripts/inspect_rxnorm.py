from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

file_path = (
    BASE_DIR
    / "raw"
    / "rxnorm"
    / "RxNorm_full_prescribe_08032026"
    / "rrf"
    / "RXNCONSO.RRF"
)

with open(file_path, "r", encoding="utf-8") as file:

    for i, line in enumerate(file):

        fields = line.rstrip("\n").split("|")

        print(f"\n--- Record {i + 1} ---")
        print("Number of fields:", len(fields))

        for j, field in enumerate(fields):
            print(f"{j}: {field}")

        if i == 4:
            break