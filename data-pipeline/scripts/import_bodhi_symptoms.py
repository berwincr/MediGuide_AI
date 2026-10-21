import csv
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = PROJECT_ROOT / "backend" / ".env"

load_dotenv(ENV_FILE)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in backend/.env")

BODHI_CSV_DIR = Path(
    r"C:\Users\BERWIN CR\Downloads\BODHI-main\BODHI-main\bodhi-s\csv"
)

SYMPTOMS_FILE = BODHI_CSV_DIR / "nodes_symptom.csv"
CONDITIONS_FILE = BODHI_CSV_DIR / "nodes_condition.csv"
EDGES_FILE = BODHI_CSV_DIR / "edges_present_in.csv"


def read_csv(file_path):
    with open(file_path, "r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def main():
    for file_path in [SYMPTOMS_FILE, CONDITIONS_FILE, EDGES_FILE]:
        if not file_path.exists():
            raise FileNotFoundError(f"CSV file not found: {file_path}")

    symptoms = read_csv(SYMPTOMS_FILE)
    conditions = read_csv(CONDITIONS_FILE)
    edges = read_csv(EDGES_FILE)

    print(f"Symptoms loaded from CSV: {len(symptoms)}")
    print(f"Conditions loaded from CSV: {len(conditions)}")
    print(f"Relationships loaded from CSV: {len(edges)}")

    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)

    try:
        client.admin.command("ping")
        db = client["mediguide"]
        collection = db["symptom_condition_mappings"]

        symptom_by_uuid = {
            row["uuid"]: row
            for row in symptoms
            if row.get("uuid")
        }

        condition_by_id = {
            row["snomed_id"]: row
            for row in conditions
            if row.get("snomed_id")
        }

        operations = []
        skipped = 0

        for edge in edges:
            symptom = symptom_by_uuid.get(edge.get("symptom_uuid"))
            condition = condition_by_id.get(
                edge.get("condition_snomed_id")
            )

            if not symptom or not condition:
                skipped += 1
                continue

            document = {
                "symptom_uuid": symptom["uuid"],
                "symptom_snomed_id": symptom.get("snomed_id") or None,
                "symptom_root_snomed_id": (
                    symptom.get("root_snomed_id") or None
                ),
                "symptom_name": symptom.get("name", "").strip(),
                "symptom_triage_level": (
                    symptom.get("triage_level") or None
                ),
                "condition_snomed_id": condition["snomed_id"],
                "condition_name": condition.get("name", "").strip(),
                "condition_type": condition.get("type_condition") or None,
                "condition_triage_level": (
                    condition.get("triage_level") or None
                ),
                "overall_likelihood": (
                    condition.get("overall_likelihood") or None
                ),
                "likelihood_symptom_given_condition": (
                    edge.get("likelihood_symptom_given_condition") or None
                ),
                "likelihood_condition_given_symptom": (
                    edge.get("likelihood_condition_given_symptom") or None
                ),
                "strong_predictor": (
                    edge.get("strong_predictor") or None
                ),
            }

            operations.append(
                UpdateOne(
                    {
                        "symptom_uuid": document["symptom_uuid"],
                        "condition_snomed_id": document["condition_snomed_id"],
                    },
                    {"$set": document},
                    upsert=True,
                )
            )

        if operations:
            result = collection.bulk_write(operations, ordered=False)
            print(f"Inserted: {result.upserted_count}")
            print(f"Updated: {result.modified_count}")
            print(f"Matched without changes: {result.matched_count}")

        print(f"Skipped unresolved relationships: {skipped}")
        print(f"Total mappings processed: {len(operations)}")
        print("BODHI-S import finished.")

    finally:
        client.close()


if __name__ == "__main__":
    main()