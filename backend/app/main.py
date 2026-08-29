from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from app.database import medicines_collection, icd10_collection, users_collection
from app.gemini_service import (
    explain_medicine,
    explain_condition,
    chat_with_ai
)
from app.models.medicine import Medicine
from app.models.user import UserCreate
from app.models.auth import UserLogin
from datetime import datetime
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.chat import ChatRequest
app = FastAPI(
    title="MediGuide AI API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to MediGuide AI API"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/medicines/count")
def medicine_count():

    total = medicines_collection.count_documents({})

    return {
        "total_documents": total
    }


# --------------------------------------------------
# SEARCH MEDICINES
# --------------------------------------------------

@app.get("/medicines/search/{name}")
def search_medicine(name: str):

    medicines = list(
        medicines_collection.find(
            {
                "name": {
                    "$regex": name,
                    "$options": "i"
                }
            },
            {
                "_id": 0,
                "rx_cui": 1,
                "name": 1,
                "term_type": 1,
                "source": 1
            }
        ).limit(20)
    )

    return {
        "query": name,
        "count": len(medicines),
        "results": medicines
    }


@app.get("/search/{query}")
def unified_search(query: str):

    # Search medicines
    medicines = list(
        medicines_collection.find(
            {
                "name": {
                    "$regex": query,
                    "$options": "i"
                }
            },
            {
                "_id": 0,
                "rx_cui": 1,
                "name": 1,
                "term_type": 1
            }
        ).limit(10)
    )

    # Search ICD-10 conditions
    conditions = list(
        icd10_collection.find(
            {
                "$or": [
                    {
                        "code": {
                            "$regex": query,
                            "$options": "i"
                        }
                    },
                    {
                        "description": {
                            "$regex": query,
                            "$options": "i"
                        }
                    }
                ]
            },
            {
                "_id": 0,
                "code": 1,
                "description": 1,
                "chapter": 1
            }
        ).limit(10)
    )

    return {
        "query": query,
        "medicines": medicines,
        "conditions": conditions
    }


# --------------------------------------------------
# GET CLEAN MEDICINE DETAILS
# --------------------------------------------------

@app.get("/medicine-details/{rx_cui}")
def get_medicine_details(rx_cui: str):

    medicine = medicines_collection.find_one(
        {"rx_cui": rx_cui},
        {"_id": 0}
    )

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    medlineplus_entries = medicine.get("medlineplus", {}).get("entries", [])

    return {
        "rx_cui": medicine.get("rx_cui"),
        "name": medicine.get("name"),
        "term_type": medicine.get("term_type"),
        "source": medicine.get("source"),
        "information": [
            {
                "title": entry.get("title"),
                "summary": entry.get("summary"),
                "url": entry.get("url")
            }
            for entry in medlineplus_entries
        ]
    }
# --------------------------------------------------
# GET MEDICINE BY RxCUI
# --------------------------------------------------

@app.get("/medicines/{rx_cui}")
def get_medicine(rx_cui: str):

    medicine = medicines_collection.find_one(
        {
            "rx_cui": rx_cui
        },
        {
            "_id": 0
        }
    )

    if not medicine:

        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    return medicine


# --------------------------------------------------
# GET ALL MEDICINES
# --------------------------------------------------

@app.get("/medicines")
def get_medicines():

    medicines = list(
        medicines_collection.find(
            {},
            {
                "_id": 0,
                "rx_cui": 1,
                "name": 1,
                "term_type": 1
            }
        ).limit(100)
    )

    return {
        "count": len(medicines),
        "results": medicines
    }


# --------------------------------------------------
# ADD CUSTOM MEDICINE
# --------------------------------------------------

@app.post("/medicines")
def add_medicine(medicine: Medicine):

    existing_medicine = medicines_collection.find_one(
        {
            "name": {
                "$regex": f"^{medicine.name}$",
                "$options": "i"
            }
        }
    )

    if existing_medicine:

        raise HTTPException(
            status_code=400,
            detail="Medicine already exists"
        )

    result = medicines_collection.insert_one(
        medicine.model_dump()
    )

    return {
        "message": "Medicine added successfully",
        "id": str(result.inserted_id)
    }

# --------------------------------------------------
# ICD-10 HEALTH CHECK
# --------------------------------------------------

@app.get("/icd10/count")
def icd10_count():

    total = icd10_collection.count_documents({})

    return {
        "total_documents": total
    }

# --------------------------------------------------
# SEARCH ICD-10 CONDITIONS
# --------------------------------------------------

@app.get("/icd10/search/{query}")
def search_icd10(query: str):

    query = query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a condition name or ICD-10 code"
        )

    conditions = list(
        icd10_collection.find(
            {
                "$or": [
                    {
                        "code": {
                            "$regex": f"^{query}",
                            "$options": "i"
                        }
                    },
                    {
                        "description": {
                            "$regex": query,
                            "$options": "i"
                        }
                    }
                ]
            },
            {
                "_id": 0,
                "code": 1,
                "description": 1,
                "chapter": 1,
                "source": 1
            }
        ).limit(20)
    )

    return {
        "query": query,
        "count": len(conditions),
        "results": conditions
    }
# --------------------------------------------------
# GET ICD-10 BY CODE
# --------------------------------------------------

@app.get("/icd10/{code}")
def get_icd10(code: str):

    condition = icd10_collection.find_one(
        {
            "code": code
        },
        {
            "_id": 0
        }
    )

    if not condition:

        raise HTTPException(
            status_code=404,
            detail="ICD-10 condition not found"
        )

    return condition

# --------------------------------------------------
# GET CLEAN ICD-10 CONDITION DETAILS
# --------------------------------------------------

@app.get("/condition-details/{code}")
def get_condition_details(code: str):

    condition = icd10_collection.find_one(
        {"code": code.upper()},
        {"_id": 0}
    )

    if not condition:
        raise HTTPException(
            status_code=404,
            detail="Condition not found"
        )

    return {
        "code": condition.get("code"),
        "description": condition.get("description"),
        "chapter": condition.get("chapter"),
        "source": condition.get("source")
    }

# --------------------------------------------------
# AI MEDICINE EXPLANATION
# --------------------------------------------------

@app.get("/medicine-ai-explanation/{rx_cui}")
def get_ai_medicine_explanation(
    rx_cui: str,
    language: str = Query(
        default="en",
        pattern="^(en|ta)$",
        description="Language: en for English, ta for Tamil"
    )
):

    # Find medicine in MongoDB
    medicine = medicines_collection.find_one(
        {
            "rx_cui": rx_cui
        },
        {
            "_id": 0
        }
    )

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    try:

        explanation = explain_medicine(
            medicine_name=medicine.get("name"),
            medicine_data=medicine,
            language=language
        )

        return {
            "rx_cui": rx_cui,
            "medicine_name": medicine.get("name"),
            "language": language,
            "ai_explanation": explanation,
            "disclaimer": (
                "This information is for educational purposes only "
                "and is not a substitute for professional medical advice."
            )
        }

    except Exception as error:

        raise HTTPException(
            status_code=503,
            detail=(
                "AI service temporarily unavailable. "
                "Please try again later."
            )
        )

# --------------------------------------------------
# AI CONDITION EXPLANATION
# --------------------------------------------------

@app.get("/condition-ai-explanation/{code}")
def get_ai_condition_explanation(
    code: str,
    language: str = Query(
        default="en",
        pattern="^(en|ta)$",
        description="Language: en for English, ta for Tamil"
    )
):

    # Find condition in MongoDB
    condition = icd10_collection.find_one(
        {
            "code": code.upper()
        },
        {
            "_id": 0
        }
    )

    if not condition:
        raise HTTPException(
            status_code=404,
            detail="Condition not found"
        )

    try:

        explanation = explain_condition(
            condition_code=condition.get("code"),
            condition_data=condition,
            language=language
        )

        return {
            "code": condition.get("code"),
            "condition_name": condition.get("description"),
            "language": language,
            "ai_explanation": explanation,
            "disclaimer": (
                "This information is for educational purposes only "
                "and is not a substitute for professional medical advice."
            )
        }

    except Exception as error:

        print("Condition AI error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "AI service temporarily unavailable. "
                "Please try again later."
            )
        )
    
 
# --------------------------------------------------
# AI CHAT ASSISTANT
# --------------------------------------------------
# --------------------------------------------------
# AI CHAT ASSISTANT
# --------------------------------------------------

@app.post("/ai-chat")
def ai_chat(request: ChatRequest):

    try:
        response = chat_with_ai(
            message=request.message,
            language=request.language
        )

        return {
            "response": response,
            "language": request.language
        }

    except Exception as error:

        print("AI Chat Error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "AI service temporarily unavailable. "
                "Please try again later."
            )
        )
    
# --------------------------------------------------
# REGISTER USER
# --------------------------------------------------

@app.post("/users/register")
def register_user(user: UserCreate):

    # Check whether email already exists
    existing_user = users_collection.find_one(
        {
            "email": user.email.lower()
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    # Create user document
    new_user = {
        "name": user.name,
        "email": user.email.lower(),
        "password": hash_password(user.password),
        "language": "en",
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

@app.post("/users/login")
def login_user(user: UserLogin):

    # Find user by email
    existing_user = users_collection.find_one(
        {
            "email": user.email.lower()
        }
    )

    # Check whether user exists
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT token
    access_token = create_access_token(
        {
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"]
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

# --------------------------------------------------
# JWT AUTHENTICATION
# --------------------------------------------------

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return payload


# --------------------------------------------------
# GET CURRENT USER
# --------------------------------------------------

@app.get("/users/me")
def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):

    user_id = current_user.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID"
        )

    existing_user = users_collection.find_one(
        {
            "_id": object_id
        },
        {
            "password": 0
        }
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Authenticated user",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user.get("name"),
            "email": existing_user.get("email"),
            "language": existing_user.get("language"),
            "created_at": existing_user.get("created_at")
        }
    }

