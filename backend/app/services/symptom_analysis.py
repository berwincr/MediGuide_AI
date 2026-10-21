
import re

from app.database import symptom_condition_mappings_collection


IGNORED_DURATION_WORDS = {
    "since",
    "for",
    "day",
    "days",
    "week",
    "weeks",
    "month",
    "months",
    "year",
    "years",
    "more",
    "than",
    "to",
}

EVIDENCE_WEIGHTS = {
    "very_high": 5,
    "very high": 5,
    "high": 4,
    "medium": 3,
    "low": 2,
    "rare": 1,
}


def tokenize(text: str) -> list[str]:
    """Extract lowercase searchable words from text."""
    return re.findall(r"[a-z0-9]+", text.lower())


def clean_symptom_name(name: str) -> str:
    """Remove dataset markup while preserving symptom duration."""
    name = re.sub(r"<\s*since\s*>", "for", name, flags=re.IGNORECASE)
    name = re.sub(r"\s+", " ", name).strip()

    # Correct common duration grammar.
    name = re.sub(r"\b1 days\b", "1 day", name, flags=re.IGNORECASE)
    name = re.sub(r"\b1 weeks\b", "1 week", name, flags=re.IGNORECASE)
    name = re.sub(r"\b1 months\b", "1 month", name, flags=re.IGNORECASE)
    name = re.sub(r"\b1 years\b", "1 year", name, flags=re.IGNORECASE)

    return name


def normalize_predictor(value) -> bool:
    """Normalize boolean values imported from CSV."""
    if isinstance(value, bool):
        return value

    if isinstance(value, (int, float)):
        return value == 1

    if isinstance(value, str):
        return value.strip().lower() in {
            "1", "true", "yes", "y"
        }

    return False


def evidence_weight(value) -> int:
    """Convert categorical evidence into a heuristic weight."""
    if not isinstance(value, str):
        return 0

    normalized = value.strip().lower().replace("-", "_")
    return EVIDENCE_WEIGHTS.get(normalized, 0)


def analyze_symptoms(symptoms: list[str]) -> dict:
    """
    Match free-text symptoms against BODHI mappings.

    Returns database associations for informational use only.
    This function does not diagnose medical conditions.
    """
    normalized_inputs = [
        symptom.strip().lower()
        for symptom in symptoms
        if isinstance(symptom, str) and symptom.strip()
    ]

    if not normalized_inputs:
        return {"symptoms": [], "conditions": []}

    mappings = list(
        symptom_condition_mappings_collection.find({})
    )

    database_symptoms = {}

    for mapping in mappings:
        raw_name = mapping.get("symptom_name")

        if not isinstance(raw_name, str) or not raw_name.strip():
            continue

        normalized_name = raw_name.strip().lower()
        database_symptoms.setdefault(
            normalized_name, []
        ).append(mapping)

    matched_symptoms = set()

    for user_input in normalized_inputs:
        user_words = set(tokenize(user_input))

        if not user_words:
            continue

        for database_name in database_symptoms:
            database_words = tokenize(database_name)

            if not database_words:
                continue

            # Match complete phrases, including multiword symptoms.
            if database_name in user_input:
                matched_symptoms.add(database_name)
                continue

            # Also match the core symptom in duration variants,
            # such as "cough <since> 5 day to 14 days".
            core_words = [
                word
                for word in database_words
                if word not in IGNORED_DURATION_WORDS
                and not word.isdigit()
            ]

            if core_words and all(
                word in user_words for word in core_words
            ):
                matched_symptoms.add(database_name)

    if not matched_symptoms:
        return {"symptoms": [], "conditions": []}

    condition_scores = {}

    for symptom_name in sorted(matched_symptoms):
        for mapping in database_symptoms[symptom_name]:
            condition_id = mapping.get("condition_snomed_id")
            condition_name = mapping.get("condition_name")

            if not condition_id or not condition_name:
                continue

            condition = condition_scores.setdefault(
                condition_id,
                {
                    "condition_id": condition_id,
                    "condition_name": condition_name,
                    "matched_symptoms": [],
                    "match_count": 0,
                    "triage_level": mapping.get(
                        "condition_triage_level"
                    ),
                    "overall_likelihood": mapping.get(
                        "overall_likelihood"
                    ),
                    "evidence": [],
                    "_evidence_score": 0,
                    "_predictor_count": 0,
                },
            )

            # Count each distinct database symptom only once.
            if symptom_name in condition["matched_symptoms"]:
                continue

            condition["matched_symptoms"].append(symptom_name)
            condition["match_count"] += 1

            symptom_given_condition = mapping.get(
                "likelihood_symptom_given_condition"
            )
            condition_given_symptom = mapping.get(
                "likelihood_condition_given_symptom"
            )
            strong_predictor = normalize_predictor(
                mapping.get("strong_predictor")
            )

            # A heuristic for ordering database matches, not a
            # probability or validated clinical score.
            condition["_evidence_score"] += (
                2 * evidence_weight(condition_given_symptom)
                + evidence_weight(symptom_given_condition)
            )

            if strong_predictor:
                condition["_predictor_count"] += 1

            condition["evidence"].append({
                "symptom": clean_symptom_name(symptom_name),
                "likelihood_symptom_given_condition":
                    symptom_given_condition,
                "likelihood_condition_given_symptom":
                    condition_given_symptom,
                "strong_predictor": strong_predictor,
            })

    conditions = list(condition_scores.values())

    conditions.sort(
        key=lambda condition: (
            -condition["match_count"],
            -condition["_predictor_count"],
            -condition["_evidence_score"],
            condition["condition_name"].lower(),
        )
    )

    # Remove internal ranking fields and clean the displayed names.
    for condition in conditions:
        condition["matched_symptoms"] = [
            clean_symptom_name(name)
            for name in condition["matched_symptoms"]
        ]

        condition.pop("_evidence_score", None)
        condition.pop("_predictor_count", None)

    return {
        "symptoms": sorted(
            clean_symptom_name(name)
            for name in matched_symptoms
        ),
        "conditions": conditions[:10],
    }


def check_symptom_mappings() -> dict:
    """Return basic database mapping statistics."""
    total = symptom_condition_mappings_collection.count_documents({})

    fever_count = symptom_condition_mappings_collection.count_documents({
        "symptom_name": {
            "$regex": "^fever$",
            "$options": "i",
        }
    })

    cough_count = symptom_condition_mappings_collection.count_documents({
        "symptom_name": {
            "$regex": "^cough$",
            "$options": "i",
        }
    })

    sample = list(
        symptom_condition_mappings_collection.find(
            {},
            {
                "_id": 0,
                "symptom_name": 1,
                "condition_name": 1,
            },
        ).limit(5)
    )

    return {
        "total_mappings": total,
        "fever_mappings": fever_count,
        "cough_mappings": cough_count,
        "sample_mappings": sample,
    }
