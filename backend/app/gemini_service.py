import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


def explain_medicine(
    medicine_name: str,
    medicine_data: dict,
    language: str = "en"
) -> str:

    # Convert language code to clear instruction
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