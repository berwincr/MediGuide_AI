import re

STOPWORDS = {
    "a", "an", "the", "is", "am", "are", "was", "were",
    "i", "me", "my", "have", "has", "had", "been",
    "of", "in", "on", "at", "to", "and", "with", "for",
    "feel", "feeling", "experiencing"
}

SPELL_CORRECTIONS = {
    "headake": "headache",
    "headche": "headache",
    "feaver": "fever",
    "caugh": "cough",
    "coughing": "cough",
    "vomitting": "vomiting",
    "dizzyness": "dizziness",
    "stomache": "stomach",
    "nausia": "nausea",
    "tierd": "tired",
    "throatpain": "throat pain",
}

SYMPTOM_SYNONYMS = {
    "head pain": "headache",
    "head aches": "headache",
    "high temperature": "fever",
    "raised temperature": "fever",
    "stomach ache": "stomach pain",
    "tummy ache": "stomach pain",
    "belly pain": "stomach pain",
    "throat ache": "sore throat",
    "painful throat": "sore throat",
    "throwing up": "vomiting",
    "being sick": "vomiting",
    "feeling sick": "nausea",
    "blocked nose": "nasal congestion",
    "stuffy nose": "nasal congestion",
    "difficulty breathing": "shortness of breath",
    "tiredness": "fatigue",
    "feeling tired": "fatigue",
    "body ache": "body pain",
    "body aches": "body pain",
}


def preprocess_symptoms(text: str) -> dict:
    original_text = text

    # 1. Normalize case and whitespace
    normalized_text = text.lower().strip()
    normalized_text = re.sub(r"\s+", " ", normalized_text)

    # 2. Split input into symptom phrases
    phrases = re.split(
        r"[,;\n]+|\band\b",
        normalized_text
    )

    processed_symptoms = []
    seen = set()

    for phrase in phrases:
        phrase = phrase.strip()

        if not phrase:
            continue

        # 3. Remove punctuation and unwanted characters
        phrase = re.sub(r"[^a-z0-9\s]", " ", phrase)
        phrase = re.sub(r"\s+", " ", phrase).strip()

        if not phrase:
            continue

        # 4. Correct known spelling mistakes
        # 4. Correct known spelling mistakes in each token 
        tokens = phrase.split()

        tokens = [
        SPELL_CORRECTIONS.get(token, token)
        for token in tokens
]

        phrase = " ".join(tokens)

        # 5. Standardize common symptom phrases
        phrase = SYMPTOM_SYNONYMS.get(phrase, phrase)

        # 6. Tokenize and remove stopwords
        tokens = phrase.split()

        tokens = [
            token
            for token in tokens
            if token not in STOPWORDS
        ]

        standardized = " ".join(tokens).strip()

        if not standardized:
            continue

        # 7. Remove duplicate symptoms
        if standardized not in seen:
            seen.add(standardized)
            processed_symptoms.append(standardized)

    return {
        "original_text": original_text,
        "normalized_text": normalized_text,
        "symptoms": processed_symptoms
    }