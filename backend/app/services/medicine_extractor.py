import re

MEDICINE_ALIASES = {
    "rivotril": "clonazepam",
    "rivooil": "clonazepam",
    "ativan": "lorazepam",
    "ariven": "lorazepam",
    "qubipin": "quetiapine",
    "qube": "quetiapine",
    "serta": "sertraline",
}


def extract_medicine_candidates(text: str):
    lines = text.splitlines()
    candidates = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        cleaned = re.sub(r"[^a-zA-Z0-9\s.-]", " ", line)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        lower = cleaned.lower()

        if "s" in lower:
            print("OCR LINE:", repr(cleaned))

        for alias in MEDICINE_ALIASES:
            if alias in lower:
                candidates.append(cleaned)
                break

    return candidates


def normalize_medicine_name(name: str):
    name_lower = name.lower()

    for brand, generic in MEDICINE_ALIASES.items():
        if brand in name_lower:
            return generic

    return name