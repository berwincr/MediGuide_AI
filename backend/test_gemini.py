from app.gemini_service import explain_medicine


result = explain_medicine(
    medicine_name="Paracetamol",
    medicine_data={
        "name": "Paracetamol",
        "general_information": "A commonly used medicine for pain and fever."
    },
    language="English"
)

print(result)