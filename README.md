#  MediGuide AI

MediGuide AI is a healthcare education platform designed to help users understand medicines and health conditions in simple, easy-to-understand language.

The platform combines medical datasets, AI-powered explanations, medicine search, condition search, bilingual support, and a conversational AI assistant.

>  **Disclaimer:** MediGuide AI is an educational platform. It does not provide medical diagnoses, prescriptions, or personalized treatment plans.

---

##  Features

###  Medicine Information

- Search medicines by name
- Retrieve standardized medicine information using RxNorm data
- View medicine details
- AI-generated medicine explanations
- Simple and understandable responses
- English and Tamil language support

###  Health Condition Information

- Search health conditions using ICD-10 data
- View condition details and classifications
- AI-generated condition explanations
- General educational information about symptoms and risk factors
- English and Tamil support

###  MediGuide AI Chat Assistant

Users can ask healthcare education questions such as:

- What is sepsis?
- What is diabetes?
- What is hypertension?
- What is paracetamol used for?
- What are common medicine precautions?

The AI assistant provides general educational information while following safety guidelines.

###  Authentication

- User registration
- User login
- Password hashing
- JWT authentication
- Protected user routes
- Current user profile endpoint

###  Bilingual Support

Currently supported languages:

- 🇬🇧 English
- 🇮🇳 Tamil

---

### Technology Stack
#### Frontend
- React
- Vite
- JavaScript
- React Router
- Lucide React
#### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
#### Database
- MongoDB Atlas
#### AI
- Google Gemini API
#### Authentication
- JWT
- Password Hashing

---

### Getting Started
#### Prerequisites

- Python 3.10+
- Node.js
- npm
- MongoDB Atlas account
- Google Gemini API key
  
#### Backend Setup
1. Navigate to the backend folder
`cd backend`
2. Create a virtual environment
`python -m venv venv`
3. Activate the virtual environment
Windows
`venv\Scripts\activate`
macOS/Linux
`source venv/bin/activate`
4. Install dependencies
`pip install -r requirements.txt`
5. Create a .env file
`MONGODB_URL=your_mongodb_connection_string`

`GEMINI_API_KEY=your_gemini_api_key`

`JWT_SECRET_KEY=your_secret_key`

> Never upload your .env file or API keys to GitHub.

6. Start the backend
`uvicorn app.main:app --reload`

The backend will run at: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

#### Frontend Setup
1. Navigate to the frontend folder
`cd frontend`
2. Install dependencies
`npm install`
3. Start the development server
`npm run dev`

The frontend will typically run at:
http://localhost:5173

---

### AI Safety Guidelines

MediGuide AI follows the following principles:

- Does not diagnose users
- Does not prescribe medicines
- Does not recommend medication dosages
- Does not tell users to start or stop medication
- Provides general educational information
- Encourages consultation with qualified healthcare professionals
- Advises immediate professional medical care for potential emergencies

---

### Data Sources

The project uses or is designed to use healthcare datasets and resources such as:

- RxNorm
- ICD-10
- MedlinePlus
- OpenFDA

These datasets help provide structured and standardized healthcare information.

---

### Supported Languages

English	`en`

Tamil	`ta`

---

### Future Improvements
- OCR-based medicine strip scanning
- Prescription scanning
- Voice interaction
- Text-to-speech responses
- Medication reminders
- Drug interaction awareness
- Improved mobile responsiveness
- Cloud deployment

---

### Medical Disclaimer

MediGuide AI is designed for healthcare education and informational purposes only.

It is not a replacement for a doctor, pharmacist, or other qualified healthcare professional.

The application does not:

- Diagnose medical conditions
- Prescribe medication
- Provide personalized treatment plans
- Replace professional medical advice

** If you are experiencing a medical emergency, seek immediate medical assistance or contact your local emergency services. ** 

