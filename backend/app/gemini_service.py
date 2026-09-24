import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

#CLIENT CONNECTED
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
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
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

Your task is to explain an ICD-10-CM health condition
in simple language for a general audience.

VERIFIED INFORMATION FROM THE MEDIGUIDE DATABASE:

ICD-10-CM CODE:
{condition_code}

CONDITION RECORD:
{condition_data}

OUTPUT LANGUAGE:
{selected_language}

==================================================
IMPORTANT SAFETY AND ACCURACY RULES
==================================================

1. This is educational information only.

2. Do not diagnose the user or suggest that the user
   has this condition.

3. Do not provide a personalized medical assessment.

4. Do not prescribe medicines, dosages, or treatment plans.

5. Do not tell the user to start, stop, increase, decrease,
   or change any medication.

6. Do not invent facts about the specific ICD-10 condition.

7. Use the provided database information to identify the
   condition and its ICD-10 classification.

8. You may provide general medical education about the
   condition, but clearly present it as general information.

9. If a requested detail cannot be explained reliably,
   say that the information is not available and recommend
   consulting a qualified healthcare professional.

10. Symptoms and severity can vary between individuals.
    Do not imply that every person experiences the same
    symptoms.

11. Do not make claims about the user's personal health.

12. Do not use frightening or alarmist language.

13. Keep the explanation concise, clear, and easy to read.

==================================================
REQUIRED RESPONSE STRUCTURE
==================================================

### What is this condition?

Explain in simple language what the condition is.

Use the ICD-10-CM code and condition name provided
in the database as the basis for the explanation.

Do not assume that the user has this condition.

### Common signs and symptoms

Explain common signs and symptoms associated with the
condition.

Present them as bullet points.

Mention that symptoms and their severity can vary
between individuals.

Do not imply that every person will experience all
of these symptoms.

### Causes and risk factors

Explain commonly recognized causes and risk factors
in general terms.

Do not assume that any particular risk factor applies
to the user.

Clearly distinguish general medical information from
personal medical assessment.

### General management

Explain broad educational approaches that may commonly
be used to manage the condition.

Do not provide a personalized treatment plan.

Do not prescribe medicines, dosages, or specific
medication schedules.

### When to seek medical help

Explain when a person should consider consulting a
qualified healthcare professional.

If there are potentially serious or emergency symptoms,
clearly advise seeking immediate medical attention.

### Important note

End with a short disclaimer explaining that the
information is for educational purposes only and does
not replace professional medical advice, diagnosis,
or treatment.

==================================================
LANGUAGE REQUIREMENT
==================================================

Generate the complete response in {selected_language}.

If {selected_language} is Tamil:

- Translate the section headings into natural Tamil.
- Use simple, understandable Tamil.
- Keep ICD-10-CM codes in English.
- Keep important medical terms in English when translating
  them would reduce clarity.
- Do not provide an English translation after the Tamil response.

If {selected_language} is English:

- Use simple English suitable for a general audience.

Do not mix languages unnecessarily.

"""

    models = [
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
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
# AI CHAT WITH CONVERSATION HISTORY
# --------------------------------------------------

def chat_with_ai(
    message: str,
    language: str = "en",
    conversation_history: list = None
) -> str:

    language_map = {
        "en": "English",
        "ta": "Tamil"
    }

    selected_language = language_map.get(
        language.lower(),
        "English"
    )

    # ---------------------------------------------
    # PREPARE CONVERSATION HISTORY
    # ---------------------------------------------

    if conversation_history is None:
        conversation_history = []

    history_text = ""

    for item in conversation_history:
        history_text += (
            f"{item['sender'].capitalize()}: "
            f"{item['message_text']}\n"
        )

    # ---------------------------------------------
    # GEMINI PROMPT
    # ---------------------------------------------

    prompt = f"""
You are MediGuide AI, a healthcare education assistant.

Your task is to provide clear, safe, and context-aware
healthcare education.

==================================================
PREVIOUS CONVERSATION
==================================================

{history_text}

==================================================
CURRENT USER QUESTION
==================================================

{message}

==================================================
CONTEXT UNDERSTANDING
==================================================

Use the previous conversation to understand the context
of the current question.

If the current question uses words such as:

- it
- this medicine
- this condition
- its side effects
- what about the side effects
- how does it work
- is it safe

determine what the user is referring to from the
previous conversation.

For example:

User: What is paracetamol?
Assistant: Paracetamol is a commonly used medicine...

User: What are the side effects?

The current question refers to PARACETAMOL.

Do not answer such follow-up questions as completely
unrelated or generic questions when the previous
conversation provides a clear context.

If the previous conversation does not provide enough
information to determine what the user means, ask a
short clarification question instead of guessing.

==================================================
SAFETY RULES
==================================================

1. Provide simple, clear educational health information.

2. Do not diagnose diseases.

3. Do not provide personalized medical diagnoses.

4. Do not prescribe medicines or dosages.

5. Do not tell users to start, stop, increase, decrease,
   or change medications.

6. Do not provide personalized treatment plans.

7. If the user describes a possible medical emergency,
   advise them to seek immediate professional medical care.

8. Do not claim to replace a doctor or healthcare
   professional.

9. Keep the explanation understandable for general users.

10. Structure longer answers clearly using headings
    or bullet points.

11. Do not invent information from the conversation.

12. If reliable information is unavailable, clearly
    state that the information is unavailable rather
    than presenting uncertain information as fact.

13. If the question is unrelated to healthcare or
    medicines, politely explain that MediGuide AI
    primarily provides healthcare education.

==================================================
LANGUAGE
==================================================

Respond completely in {selected_language}.

If the selected language is Tamil:

- Use natural, simple Tamil.
- Keep important medical terms in English when this
  improves clarity.
- Do not provide a separate English translation.

If the selected language is English:

- Use simple English suitable for a general audience.

==================================================
IMPORTANT
==================================================

This is an educational assistant, not a diagnostic
or prescribing system.

Use the conversation history to maintain context
between messages.
"""

    # ---------------------------------------------
    # GEMINI MODEL FALLBACK
    # ---------------------------------------------

    models = [
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
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
        "AI service temporarily unavailable."
    )