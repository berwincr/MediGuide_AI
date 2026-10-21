from app.services.symptom_preprocessing import preprocess_symptoms


test_cases = [
    "I have a headache, HEADACHE and tummy ache",
    "feeling tired and throwing up",
    "  Stomach ache,   headache  ",
    "head pain; fatigue"
]

for text in test_cases:
    result = preprocess_symptoms(text)

    print("\nInput:", text)
    print("Processed symptoms:", result["symptoms"])