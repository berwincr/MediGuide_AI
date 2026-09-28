from app.database import db


drug_interactions_collection = db[
    "drug_interactions"
]

ddinter_drugs_collection = db[
    "ddinter_drugs"
]


def check_drug_interactions(
    medicines: list[str]
):

    interactions = []
    unrecognized_medicines = []

    normalized_medicines = [
        medicine.strip()
        for medicine in medicines
        if medicine.strip()
    ]

    # Find DDInter ID for every medicine
    medicine_mapping = {}

    for medicine in normalized_medicines:

        result = ddinter_drugs_collection.find_one(
            {
                "drug_name": {
                    "$regex": f"^{medicine}$",
                    "$options": "i"
                }
            },
            {
                "_id": 0,
                "ddinter_id": 1,
                "drug_name": 1
            }
        )

        if result:
            medicine_mapping[medicine] = result
        else:
            unrecognized_medicines.append(
                medicine
            )

    # Check every possible medicine pair
    for i in range(
        len(normalized_medicines)
    ):

        for j in range(
            i + 1,
            len(normalized_medicines)
        ):

            medicine_a = normalized_medicines[i]
            medicine_b = normalized_medicines[j]

            result_a = medicine_mapping.get(
                medicine_a
            )

            result_b = medicine_mapping.get(
                medicine_b
            )

            # Skip if either medicine is not recognized
            if not result_a or not result_b:
                continue

            ddinter_id_a = result_a["ddinter_id"]
            ddinter_id_b = result_b["ddinter_id"]

            interaction = drug_interactions_collection.find_one(
                {
                    "$or": [
                        {
                            "ddinter_id_a": ddinter_id_a,
                            "ddinter_id_b": ddinter_id_b
                        },
                        {
                            "ddinter_id_a": ddinter_id_b,
                            "ddinter_id_b": ddinter_id_a
                        }
                    ]
                },
                {
                    "_id": 0,
                    "drug_a": 1,
                    "drug_b": 1,
                    "level": 1
                }
            )

            if interaction:

                interactions.append(
                    {
                        "drug_a": interaction["drug_a"],
                        "drug_b": interaction["drug_b"],
                        "level": interaction["level"]
                    }
                )

    # Count severity levels
    major = 0
    moderate = 0
    minor = 0
    unknown = 0

    for interaction in interactions:

        level = interaction["level"].lower()

        if level == "major":
            major += 1

        elif level == "moderate":
            moderate += 1

        elif level == "minor":
            minor += 1

        elif level == "unknown":
            unknown += 1

    total_pairs = (
        len(normalized_medicines)
        * (len(normalized_medicines) - 1)
        // 2
    )

    return {
        "medicines_checked": medicines,

        "unrecognized_medicines": (
            unrecognized_medicines
        ),

        "summary": {
            "total_pairs_checked": total_pairs,
            "interactions_found": len(interactions),
            "no_interaction_found": (
                total_pairs - len(interactions)
            ),
            "major": major,
            "moderate": moderate,
            "minor": minor,
            "unknown": unknown
        },

        "interactions": interactions
    }