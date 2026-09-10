# MediGuide AI 

MediGuide AI is a healthcare education platform designed to help users understand medicines and health conditions in simple, easy-to-understand language.

The platform combines structured medical datasets, AI-powered explanations, medicine and condition search, OCR-based prescription scanning, bilingual support, conversational AI, and medication reminders.

> **Disclaimer:** MediGuide AI is an educational platform. It does not provide medical diagnoses, prescriptions, or personalized treatment plans.

---

## Features

### Medicine Information

- Search medicines by name
- Retrieve standardized medicine information using RxNorm
- View detailed medicine information
- AI-generated medicine explanations
- Simple and understandable explanations
- English and Tamil language support

### Health Condition Information

- Search health conditions using ICD-10 data
- View condition details and classifications
- AI-generated condition explanations
- Educational information about symptoms and risk factors
- English and Tamil support

### MediGuide AI Chat Assistant

Users can ask healthcare education questions such as:

- What is sepsis?
- What is diabetes?
- What is hypertension?
- What is paracetamol used for?
- What are common medicine precautions?

The AI assistant provides general educational information while following safety guidelines.

### OCR Prescription Scanner

MediGuide AI includes an OCR-based prescription scanning feature.

Users can:

- Upload a prescription image
- Extract text using Tesseract OCR
- Identify possible medicine names from OCR output
- Normalize detected brand names to generic medicine names
- Match recognized medicines with RxNorm
- Retrieve standardized medicine information

The OCR pipeline uses:

- **Tesseract OCR**
- **Pytesseract**
- **Python**
- **RxNorm**
- Medicine name normalization and matching

> OCR results may contain errors, especially with handwritten prescriptions. Detected medicines should always be verified by a qualified healthcare professional.

### Medication Reminders

MediGuide AI provides medication reminder functionality.

Users can:

- Create medicine reminders
- Specify dosage and frequency
- Set reminder times
- Set start and end dates
- Add notes
- View active reminders
- Delete reminders

Reminder information is stored in MongoDB and associated with the authenticated user.

### Browser Push Notifications

MediGuide AI supports browser push notifications for medication reminders.

The notification system uses:

- Web Push API
- Service Workers
- VAPID authentication
- Node.js
- Express
- `web-push`
- FastAPI
- APScheduler

The notification architecture separates the push notification service from the main FastAPI backend.

```text
FastAPI
   │
   │ Reminder Scheduler
   ▼
APScheduler
   │
   ▼
Node.js Push Service
   │
   ▼
Web Push
   │
   ▼
Browser Service Worker
   │
   ▼
 Medicine Reminder Notification
```

### Authentication

- User registration
- User login
- Password hashing
- JWT authentication
- Protected routes
- Current user profile endpoint
- User-specific reminders
- Secure push subscription storage

### Bilingual Support

Currently supported languages:

- 🇬🇧 English — `en`
- 🇮🇳 Tamil — `ta`

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Lucide React
- Service Workers
- Web Push API

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- APScheduler

### Database

- MongoDB Atlas
- PyMongo

### AI

- Google Gemini API

### OCR

- Tesseract OCR
- Pytesseract
- Pillow

### Authentication

- JWT
- Password Hashing

### Push Notifications

- Node.js
- Express
- `web-push`
- VAPID

### Medical Data

- RxNorm
- ICD-10
- MedlinePlus
- OpenFDA

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │       + Vite        │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │      Backend        │
                         └──────┬───────┬──────┘
                                │       │
                 ┌──────────────┘       └──────────────┐
                 ▼                                      ▼
        ┌─────────────────┐                    ┌─────────────────┐
        │  MongoDB Atlas  │                    │   Gemini API    │
        └─────────────────┘                    └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ RxNorm / ICD-10 │
        │  Medical Data   │
        └─────────────────┘
```

### Prescription Scanning Flow

```text
Prescription Image
        │
        ▼
   Tesseract OCR
        │
        ▼
   Extracted Text
        │
        ▼
Medicine Candidate Extraction
        │
        ▼
 Brand Name Normalization
        │
        ▼
 Generic Medicine Name
        │
        ▼
    RxNorm Matching
        │
        ▼
Medicine Information
```

### Medication Reminder Flow

```text
Create Reminder
        │
        ▼
    MongoDB
        │
        ▼
   APScheduler
        │
        ▼
     FastAPI
        │
        ▼
Node.js Push Service
        │
        ▼
     Web Push
        │
        ▼
Service Worker
        │
        ▼
Browser Notification 
```

---

## Project Structure

```text
MediGuide_AI/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── chat.py
│   │   │   └── reminder.py
│   │   │
│   │   ├── services/
│   │   │   ├── medicine_extractor.py
│   │   │   ├── ocr_service.py
│   │   │   ├── push_service.py
│   │   │   └── scheduler.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── reminder-sw.js
│   │
│   └── src/
│       ├── components/
│       │
│       ├── pages/
│       │   ├── AIAssistant.jsx
│       │   ├── AIChat.jsx
│       │   ├── ConditionDetails.jsx
│       │   ├── ConditionSearch.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── MedicineDetails.jsx
│       │   ├── MedicineSearch.jsx
│       │   ├── OCR.jsx
│       │   ├── Register.jsx
│       │   └── Reminder.jsx
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── push-service/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── data-pipeline/
│
└── README.md
```

---

##  Getting Started

### Prerequisites

Make sure you have:

- Python 3.10+
- Node.js
- npm
- MongoDB Atlas account
- Google Gemini API key
- Tesseract OCR

---

### 1. Clone the Repository

```bash
git clone https://github.com/berwincr/MediGuide_AI.git
cd MediGuide_AI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_secret_key
```

> **Never upload your `.env` file or API keys to GitHub.**

Start the backend:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

---

### 4. Tesseract OCR Setup

Install Tesseract OCR on your system.

The Python OCR service uses `pytesseract` to communicate with the Tesseract executable.

Example Windows installation path:

```text
C:\Program Files\Tesseract-OCR\tesseract.exe
```

The OCR service processes uploaded prescription images and extracts possible medicine names.

---

### 5. Push Notification Service

Open another terminal and navigate to the push service:

```bash
cd push-service
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `push-service` directory:

```env
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

Start the push service:

```bash
node server.js
```

The push service runs at:

```text
http://127.0.0.1:3001
```

> **Never commit the VAPID private key to GitHub.**

---

## OCR Medicine Detection

The OCR system processes prescription images through multiple stages:

```text
Image
  ↓
Tesseract OCR
  ↓
Text Extraction
  ↓
Medicine Candidate Detection
  ↓
Brand Name Normalization
  ↓
Generic Name
  ↓
RxNorm Matching
  ↓
Standardized Medicine Information
```

The medicine extraction service includes alias normalization for recognized medicine names and attempts to match them against standardized RxNorm concepts.

Example:

```text
Rivotril
    ↓
Clonazepam
    ↓
RxNorm
    ↓
RxCUI
```

Similarly, recognized brand names can be normalized before querying the medicine database.

> Prescription OCR is inherently error-prone, particularly with handwritten prescriptions. OCR output should be treated as a possible detection and verified by a qualified healthcare professional.

---

## Medication Reminder System

The reminder system consists of three main components.

### 1. Reminder Storage

Reminder information is stored in MongoDB and linked to the authenticated user's ID.

### 2. Background Scheduler

APScheduler runs in the FastAPI backend and periodically checks active reminders.

### 3. Push Notification Service

When a reminder is due:

```text
APScheduler
     ↓
FastAPI Push Service
     ↓
Node.js
     ↓
web-push
     ↓
Browser
     ↓
Service Worker
     ↓
Medicine Reminder 
```

The system also prevents the same reminder from being sent repeatedly during the same scheduled minute.

---

## Security

MediGuide AI includes several security mechanisms:

- JWT-based authentication
- Password hashing
- Protected API endpoints
- User-specific reminder access
- User-specific push subscriptions
- Environment variables for secrets
- `.gitignore` protection for credentials
- VAPID authentication for Web Push

Sensitive credentials are intentionally excluded from version control.

---

## AI Safety Guidelines

MediGuide AI follows these principles:

- Does not diagnose users
- Does not prescribe medicines
- Does not recommend medication dosages
- Does not instruct users to start or stop medication
- Provides general educational information
- Encourages consultation with qualified healthcare professionals
- Advises immediate professional medical care for potential emergencies

---

## Data Sources

The project uses or is designed to use healthcare datasets and resources such as:

- RxNorm
- ICD-10
- MedlinePlus
- OpenFDA

These resources help provide structured and standardized healthcare information.

---

## Supported Languages

| Language | Code |
|----------|------|
| English 🇬🇧 | `en` |
| Tamil 🇮🇳 | `ta` |

---

## Future Improvements

The following features are planned for future development:

- Improved handwritten prescription OCR
- Voice interaction
- Text-to-speech responses
- Drug interaction awareness
- More robust medicine matching
- Advanced medication scheduling
- Multiple reminder times per day
- Improved mobile responsiveness
- Cloud deployment
- Production-grade push notification infrastructure
- Expanded multilingual support

---

## Current Project Status

### Completed

- [x] Medicine Search
- [x] Medicine Details
- [x] Condition Search
- [x] Condition Details
- [x] AI Medicine Explanations
- [x] AI Condition Explanations
- [x] AI Chat Assistant
- [x] JWT Authentication
- [x] User Registration and Login
- [x] English and Tamil Support
- [x] OCR Prescription Scanning
- [x] Tesseract OCR Integration
- [x] Medicine Candidate Extraction
- [x] Medicine Name Normalization
- [x] RxNorm Medicine Matching
- [x] Medication Reminders
- [x] MongoDB Reminder Storage
- [x] Background Reminder Scheduler
- [x] Browser Push Notifications
- [x] Web Push Service
- [x] Service Worker Integration
- [x] VAPID Push Authentication

### In Development

- [ ] Improved handwritten prescription recognition
- [ ] Drug interaction awareness
- [ ] Voice interaction
- [ ] Advanced reminder scheduling
- [ ] Cloud deployment

---

## Medical Disclaimer

MediGuide AI is designed for healthcare education and informational purposes only.

It is not a replacement for a doctor, pharmacist, or other qualified healthcare professional.

The application does not:

- Diagnose medical conditions
- Prescribe medication
- Provide personalized treatment plans
- Replace professional medical advice

> **If you are experiencing a medical emergency, seek immediate medical assistance or contact your local emergency services.**

---

##  Development

MediGuide AI is being developed as a software engineering project combining:

- Full-stack web development
- REST API development
- Database design
- AI integration
- OCR
- Healthcare data processing
- Authentication
- Browser notifications
- Background job scheduling
- Web Push infrastructure

---

## Project Status

**Active Development**

MediGuide AI is continuously being improved with new healthcare education, AI, OCR, and reminder capabilities.