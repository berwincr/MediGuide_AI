import re

from rapidfuzz import process, fuzz, utils

from app.database import medicines_collection


# --------------------------------------------------
# COMMON MEDICINE ALIASES
# --------------------------------------------------

MEDICINE_ALIASES = {
    "paracetamol": "acetaminophen",
    "dolo": "acetaminophen",
    "dolo 650": "acetaminophen",
    "crocin": "acetaminophen",
    "calpol": "acetaminophen",

    "brufen": "ibuprofen",

    "rivotril": "clonazepam",
    "rivooil": "clonazepam",

    "ativan": "lorazepam",
    "ariven": "lorazepam",

    "qubipin": "quetiapine",
    "qube": "quetiapine",

    "serta": "sertraline",

    "zyrtec": "cetirizine",

    "pantocid": "pantoprazole",

    "omez": "omeprazole",

    "azithral": "azithromycin",
}


# --------------------------------------------------
# NON-SPECIFIC MEDICATION TERMS
# --------------------------------------------------

MEDICATION_CLASSES = {
    "expectorant",
    "antibiotic",
    "anti-biotic",
    "analgesic",
    "antacid",
    "antihistamine",
    "antidepressant",
    "antiviral",
    "antifungal",
    "antiseptic",
    "decongestant",
    "corticosteroid",
    "painkiller",
    "sedative",
    "laxative",
    "diuretic",
    "antipyretic",
}


# --------------------------------------------------
# GENERIC OCR NOISE WORDS
# --------------------------------------------------

OCR_NOISE = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "this",
    "that",
    "patient",
    "information",
    "name",
    "date",
    "number",
    "phone",
    "email",
    "address",
    "age",
}


# --------------------------------------------------
# CACHE
# --------------------------------------------------

_medicine_names = None


# --------------------------------------------------
# LOAD MEDICINE NAMES
# --------------------------------------------------

def _load_medicine_names():

    global _medicine_names

    if _medicine_names is not None:
        return _medicine_names

    documents = medicines_collection.find(
        {
            "name": {
                "$exists": True,
                "$ne": None
            }
        },
        {
            "_id": 0,
            "name": 1
        }
    )

    names = set()

    for document in documents:

        name = document.get("name")

        if not name:
            continue

        name = str(name).strip().lower()

        if len(name) < 4:
            continue

        names.add(name)

    _medicine_names = sorted(names)

    print(
        f"Loaded "
        f"{len(_medicine_names)} medicine names"
    )

    return _medicine_names


# --------------------------------------------------
# CLEAN OCR TEXT
# --------------------------------------------------

def clean_ocr_text(text):

    text = text.strip()

    text = re.sub(
        r"[^a-zA-Z0-9\s./-]",
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
# REMOVE DOSAGE INFORMATION
# --------------------------------------------------

def remove_dosage_information(text):

    text = re.sub(
        r"\b\d+(?:\.\d+)?\s*"
        r"(?:mg|mcg|g|ml|mL|iu|units?)\b",
        " ",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\b\d+(?:-\d+){1,3}\b",
        " ",
        text
    )

    text = re.sub(
        r"\b\d+\s*(?:mg|mcg|g|ml)\b",
        " ",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# --------------------------------------------------
# ALIAS MATCH
# --------------------------------------------------

def find_alias(text):

    text = text.lower().strip()

    aliases = sorted(
        MEDICINE_ALIASES.items(),
        key=lambda item: len(item[0]),
        reverse=True
    )

    for alias, generic in aliases:

        if text == alias:

            return generic

        if re.search(
            rf"\b{re.escape(alias)}\b",
            text
        ):

            return generic

    return None


# --------------------------------------------------
# MEDICATION CLASS
# --------------------------------------------------

def find_medication_class(text):

    text = text.lower()

    for medication_class in MEDICATION_CLASSES:

        if re.search(
            rf"\b{re.escape(medication_class)}\b",
            text
        ):

            return medication_class

    return None


# --------------------------------------------------
# EXACT DATABASE MATCH
# --------------------------------------------------

def exact_database_match(text):

    text = text.lower().strip()

    medicine_names = (
        _load_medicine_names()
    )

    if text in medicine_names:

        return text

    return None


# --------------------------------------------------
# FUZZY DATABASE MATCH
# --------------------------------------------------

def fuzzy_match_medicine(
    text,
    score_cutoff=92
):

    text = text.lower().strip()

    if len(text) < 6:
        return None

    medicine_names = (
        _load_medicine_names()
    )

    if not medicine_names:
        return None

    result = process.extractOne(
        text,
        medicine_names,
        scorer=fuzz.ratio,
        processor=utils.default_process,
        score_cutoff=score_cutoff
    )

    if result is None:
        return None

    matched_name, score, _ = result

    print(
        f"FUZZY MATCH: "
        f"{text} -> "
        f"{matched_name} "
        f"({score:.1f})"
    )

    return matched_name


# --------------------------------------------------
# GENERATE TEXT CANDIDATES
# --------------------------------------------------

def generate_candidates(line):

    cleaned = clean_ocr_text(line)

    cleaned = (
        remove_dosage_information(
            cleaned
        )
    )

    if not cleaned:
        return []

    words = cleaned.lower().split()

    candidates = []

    # Individual words
    for word in words:

        if len(word) >= 4:

            candidates.append(
                word
            )

    # Two-word combinations
    for i in range(
        len(words) - 1
    ):

        phrase = (
            words[i]
            + " "
            + words[i + 1]
        )

        candidates.append(
            phrase
        )

    return candidates


# --------------------------------------------------
# EXTRACT MEDICINES
# --------------------------------------------------

def extract_medicine_candidates(
    text: str
):

    lines = text.splitlines()

    medicines = []

    seen = set()

    for line in lines:

        cleaned = clean_ocr_text(
            line
        )

        if not cleaned:
            continue

        print(
            "OCR LINE:",
            repr(cleaned)
        )

        lower = cleaned.lower()

        # ------------------------------------------
        # Ignore obvious non-content
        # ------------------------------------------

        if lower in OCR_NOISE:
            continue

        # ------------------------------------------
        # Medication class
        # ------------------------------------------

        medication_class = (
            find_medication_class(
                lower
            )
        )

        if medication_class:

            print(
                "MEDICATION CLASS:",
                medication_class
            )

            continue

        # ------------------------------------------
        # Generate possible candidates
        # ------------------------------------------

        candidates = generate_candidates(
            cleaned
        )

        for candidate in candidates:

            candidate = candidate.strip()

            if not candidate:
                continue

            # --------------------------------------
            # Ignore generic words
            # --------------------------------------

            if candidate in OCR_NOISE:
                continue

            # --------------------------------------
            # Alias
            # --------------------------------------

            alias_match = find_alias(
                candidate
            )

            if alias_match:

                if alias_match not in seen:

                    medicines.append(
                        alias_match
                    )

                    seen.add(
                        alias_match
                    )

                print(
                    "ALIAS MATCH:",
                    candidate,
                    "->",
                    alias_match
                )

                continue

            # --------------------------------------
            # Exact RxNorm
            # --------------------------------------

            exact_match = (
                exact_database_match(
                    candidate
                )
            )

            if exact_match:

                if exact_match not in seen:

                    medicines.append(
                        exact_match
                    )

                    seen.add(
                        exact_match
                    )

                print(
                    "EXACT MATCH:",
                    candidate
                )

                continue

            # --------------------------------------
            # Fuzzy matching
            # --------------------------------------

            fuzzy_match = (
                fuzzy_match_medicine(
                    candidate,
                    score_cutoff=92
                )
            )

            if fuzzy_match:

                if fuzzy_match not in seen:

                    medicines.append(
                        fuzzy_match
                    )

                    seen.add(
                        fuzzy_match
                    )

    return medicines


# --------------------------------------------------
# NORMALIZE MEDICINE
# --------------------------------------------------

def normalize_medicine_name(
    name: str
):

    if not name:
        return ""

    cleaned = clean_ocr_text(
        name
    )

    cleaned = (
        remove_dosage_information(
            cleaned
        )
    )

    cleaned = cleaned.lower().strip()

    # Alias
    alias_match = find_alias(
        cleaned
    )

    if alias_match:

        return alias_match

    # Exact database
    exact_match = (
        exact_database_match(
            cleaned
        )
    )

    if exact_match:

        return exact_match

    # Fuzzy database
    fuzzy_match = (
        fuzzy_match_medicine(
            cleaned,
            score_cutoff=92
        )
    )

    if fuzzy_match:

        return fuzzy_match

    return cleaned