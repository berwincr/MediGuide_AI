import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# --------------------------------------------------
# AI MEDICINE EXPLANATION
# --------------------------------------------------

def explain_medicine(
    medicine_name: str,
    medicine_data: dict,
    language: str = "en"
) -> str:

    language_map = {
        "en": "English",
        "ta": "Tamil"
    }

    selected_language = language_map.get(
        language.lower(),
        "English"
    )

    prompt = f"""
You are MediGuide AI, a healthcare education assistant.

Your task is to explain medicine information in simple language.

MEDICINE NAME:
{medicine_name}

VERIFIED MEDICINE INFORMATION FROM DATABASE:
{medicine_data}

OUTPUT LANGUAGE:
{selected_language}

INSTRUCTIONS:

1. Use the provided medicine information as your primary source.
2. Do not invent medical facts that are not supported by the provided information.
3. Explain the medicine in simple language suitable for a general user.
4. Do not diagnose any disease or medical condition.
5. Do not prescribe a dosage.
6. Do not tell the user to start, stop, or change medication.
7. If information is unavailable in the database, clearly say that the information is not available.
8. Keep the response structured and easy to understand.

STRUCTURE:

### What is this medicine?
Explain what the medicine is generally used for.

### How does it work?
Explain using simple, non-technical language.
If the database does not provide enough information, say so.

### Important precautions
Only mention precautions supported by the provided information.

### Possible side effects
Only mention side effects available in the provided information.

### Important note
State that the information is educational and users should consult a qualified healthcare professional or pharmacist for personal medical advice.

LANGUAGE REQUIREMENT:
Generate the complete response in {selected_language}.
Do not mix languages unless a medicine name or technical term must remain unchanged.
"""

    models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-2.5-flash"
    ]

    for model_name in models:

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if response.text:
                return response.text

        except Exception as error:
            print(
                f"{model_name} failed: {error}"
            )

    raise Exception(
        "All Gemini models are currently unavailable. "
        "Please try again later."
    )


# --------------------------------------------------
# AI CONDITION EXPLANATION
# --------------------------------------------------

def explain_condition(
    condition_code: str,
    condition_data: dict,
    language: str = "en"
) -> str:

    language_map = {
        "en": "English",
        "ta": "Tamil"
    }

    selected_language = language_map.get(
        language.lower(),
        "English"
    )

    prompt = f"""
You are MediGuide AI, a healthcare education assistant.

Your task is to explain a health condition in simple,
clear, educational language.

VERIFIED CONDITION INFORMATION FROM DATABASE:

ICD-10 CODE:
{condition_code}

CONDITION DATA:
{condition_data}

OUTPUT LANGUAGE:
{selected_language}

IMPORTANT SAFETY RULES:

1. This is educational information only.
2. Do not diagnose the user.
3. Do not claim that the user has this condition.
4. Do not provide personalized treatment plans.
5. Do not prescribe medicines or dosages.
6. Do not tell users to stop or change their medication.
7. Use the database information as the source for the
   specific condition identification and classification.
8. General educational medical information may be used to
   explain the condition, but do not present it as a
   personalized medical assessment.
9. If information cannot be explained confidently,
   clearly say that more information should be obtained
   from a qualified healthcare professional.
10. Keep the explanation simple and understandable.

RESPONSE STRUCTURE:

### What is this condition?
Explain the condition in simple terms.

### Common signs and symptoms
Provide general educational information.
Clearly mention that symptoms can vary between individuals.

### General causes or risk factors
Explain common causes or risk factors where appropriate.
Do not assume any cause applies to the user.

### General management and prevention
Provide broad educational information only.
Do not provide a personalized treatment plan.

### When to seek medical help
Give general guidance about consulting a qualified
healthcare professional.

### Important note
Clearly state that this explanation is for educational
purposes and is not a diagnosis or replacement for
professional medical advice.

LANGUAGE REQUIREMENT:
Generate the complete response in {selected_language}.
Do not mix languages unless a medical term needs to
remain unchanged.
"""

    models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-2.5-flash"
    ]

    for model_name in models:

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if response.text:
                return response.text

        except Exception as error:
            print(
                f"{model_name} failed: {error}"
            )

    raise Exception(
        "All Gemini models are currently unavailable. "
        "Please try again later."
    )

def chat_with_ai(
    message: str,
    language: str = "en"
) -> str:

    language_map = {
        "en": "English",
        "ta": "Tamil"
    }

    selected_language = language_map.get(
        language.lower(),
        "English"
    )

    prompt = f"""
You are MediGuide AI, a healthcare education assistant.

The user asked:

{message}

Respond in {selected_language}.

RULES:

1. Provide simple, clear educational health information.
2. Do not diagnose diseases.
3. Do not prescribe medicines or dosages.
4. Do not tell users to start, stop, or change medications.
5. If the user describes a possible medical emergency, advise them to seek immediate professional medical care.
6. Do not claim to replace a doctor or healthcare professional.
7. Keep the explanation understandable for general users.
8. Structure longer answers clearly using headings or bullet points.
9. Generate the complete response in {selected_language}.
10. If the question is unrelated to healthcare or medicines, politely explain that MediGuide AI primarily provides healthcare education.

IMPORTANT:
This is an educational assistant, not a diagnostic or prescribing system.
"""

    models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-2.5-flash"
    ]

    for model_name in models:

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if response.text:
                return response.text

        except Exception as error:
            print(f"{model_name} failed: {error}")

    raise Exception(
        "AI service temporarily unavailable."
    )