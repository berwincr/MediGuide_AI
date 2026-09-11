import os
import shutil

from datetime import datetime, timezone

from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File,
    Depends,
    Query
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from app.database import (
    medicines_collection,
    icd10_collection,
    users_collection,
    reminders_collection,
    chat_sessions_collection,
    chat_messages_collection
)

from app.services.ocr_service import extract_text

from app.services.medicine_extractor import (
    extract_medicine_candidates,
    normalize_medicine_name
)

from app.services.push_service import send_push_notification

from app.services.scheduler import (
    start_scheduler,
    stop_scheduler
)

from app.gemini_service import (
    explain_medicine,
    explain_condition,
    chat_with_ai
)

from app.models.medicine import Medicine
from app.models.user import UserCreate
from app.models.auth import UserLogin
from app.models.chat import ChatRequest, ChatSessionCreate
from app.models.reminder import (
    ReminderRequest,
    PushSubscription
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


app = FastAPI(
    title="MediGuide AI API"
)


# ==================================================
# SCHEDULER STARTUP / SHUTDOWN
# ==================================================

@app.on_event("startup")
def startup_event():
    print("STARTING MEDICINE REMINDER SCHEDULER")
    start_scheduler()


@app.on_event("shutdown")
def shutdown_event():
    print("STOPPING MEDICINE REMINDER SCHEDULER")
    stop_scheduler()


# ==================================================
# CORS
# ==================================================

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


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to MediGuide AI API"
    }


# ==================================================
# MEDICINE HEALTH CHECK
# ==================================================

@app.get("/medicines/count")
def medicine_count():

    total = medicines_collection.count_documents({})

    return {
        "total_documents": total
    }


# ==================================================
# SEARCH MEDICINES
# ==================================================

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


# ==================================================
# UNIFIED SEARCH
# ==================================================

@app.get("/search/{query}")
def unified_search(query: str):

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


# ==================================================
# CLEAN MEDICINE DETAILS
# ==================================================

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

    medlineplus_entries = (
        medicine
        .get("medlineplus", {})
        .get("entries", [])
    )

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


# ==================================================
# GET MEDICINE BY RxCUI
# ==================================================

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


# ==================================================
# GET ALL MEDICINES
# ==================================================

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


# ==================================================
# ADD CUSTOM MEDICINE
# ==================================================

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


# ==================================================
# ICD-10 HEALTH CHECK
# ==================================================

@app.get("/icd10/count")
def icd10_count():

    total = icd10_collection.count_documents({})

    return {
        "total_documents": total
    }


# ==================================================
# SEARCH ICD-10 CONDITIONS
# ==================================================
@app.get("/icd10/search/{query}")
def search_icd10(
    query: str,
    page: int = 1,
    limit: int = 20
):

    query = query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a condition name or ICD-10 code"
        )

    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than 0"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100"
        )

    query_lower = query.lower()

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
        )
    )

    conditions.sort(
        key=lambda x: (
            not x["description"].lower().startswith(query_lower),
            len(x["code"])
        )
    )

    total = len(conditions)

    start = (page - 1) * limit
    end = start + limit

    paginated_results = conditions[start:end]

    total_pages = (total + limit - 1) // limit

    return {
        "query": query,
        "count": len(paginated_results),
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "results": paginated_results
    }
# ==================================================
# GET ICD-10 BY CODE
# ==================================================

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


# ==================================================
# CLEAN ICD-10 CONDITION DETAILS
# ==================================================

@app.get("/condition-details/{code}")
def get_condition_details(code: str):

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

    return {
        "code": condition.get("code"),
        "description": condition.get("description"),
        "chapter": condition.get("chapter"),
        "source": condition.get("source")
    }


# ==================================================
# AI MEDICINE EXPLANATION
# ==================================================

@app.get("/medicine-ai-explanation/{rx_cui}")
def get_ai_medicine_explanation(
    rx_cui: str,
    language: str = Query(
        default="en",
        pattern="^(en|ta)$",
        description="Language: en for English, ta for Tamil"
    )
):

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

        print("Medicine AI error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "AI service temporarily unavailable. "
                "Please try again later."
            )
        )


# ==================================================
# AI CONDITION EXPLANATION
# ==================================================

@app.get("/condition-ai-explanation/{code}")
def get_ai_condition_explanation(
    code: str,
    language: str = Query(
        default="en",
        pattern="^(en|ta)$",
        description="Language: en for English, ta for Tamil"
    )
):

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


# ==================================================
# AI CHAT ASSISTANT
# ==================================================

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


# ==================================================
# REGISTER USER
# ==================================================

@app.post("/users/register")
def register_user(user: UserCreate):

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

    new_user = {
        "name": user.name,
        "email": user.email.lower(),
        "password": hash_password(user.password),
        "language": "en",
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(
        new_user
    )

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


# ==================================================
# LOGIN USER
# ==================================================

@app.post("/users/login")
def login_user(user: UserLogin):

    existing_user = users_collection.find_one(
        {
            "email": user.email.lower()
        }
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

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


# ==================================================
# JWT AUTHENTICATION
# ==================================================

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


# ==================================================
# GET CURRENT USER
# ==================================================

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


# ==================================================
# OCR PRESCRIPTION
# ==================================================

@app.post("/ocr")
async def ocr(
    file: UploadFile = File(...)
):

    os.makedirs(
        "uploads",
        exist_ok=True
    )

    file_path = os.path.join(
        "uploads",
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    text = extract_text(
        file_path
    )

    candidates = extract_medicine_candidates(
        text
    )

    medicines = []

    for candidate in candidates:

        generic_name = normalize_medicine_name(
            candidate
        )

        results = list(
            medicines_collection.find(
                {
                    "name": {
                        "$regex": generic_name,
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
            ).limit(5)
        )

        medicines.append(
            {
                "ocr_name": candidate,
                "possible_generic": generic_name,
                "matches": results
            }
        )

    os.remove(file_path)

    return {
        "filename": file.filename,
        "text": text,
        "medicines": medicines
    }


# ==================================================
# CREATE REMINDER
# ==================================================

@app.post("/reminders")
def create_reminder(
    reminder: ReminderRequest,
    current_user=Depends(get_current_user)
):

    reminder_data = reminder.model_dump()

    reminder_data["user_id"] = current_user["sub"]

    reminder_data["active"] = True

    result = reminders_collection.insert_one(
        reminder_data
    )

    return {
        "message": "Reminder created successfully",
        "reminder_id": str(result.inserted_id)
    }


# ==================================================
# GET REMINDERS
# ==================================================

@app.get("/reminders")
def get_reminders(
    current_user=Depends(get_current_user)
):

    reminders = list(
        reminders_collection.find(
            {
                "user_id": current_user["sub"]
            },
            {
                "_id": 1,
                "medicine_name": 1,
                "rx_cui": 1,
                "dosage": 1,
                "frequency": 1,
                "time": 1,
                "start_date": 1,
                "end_date": 1,
                "notes": 1,
                "active": 1
            }
        )
    )

    for reminder in reminders:

        reminder["_id"] = str(
            reminder["_id"]
        )

    return reminders


# ==================================================
# DELETE REMINDER
# ==================================================

@app.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: str,
    current_user=Depends(get_current_user)
):

    result = reminders_collection.delete_one(
        {
            "_id": ObjectId(reminder_id),
            "user_id": current_user["sub"]
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    return {
        "message": "Reminder deleted successfully"
    }


# ==================================================
# SAVE PUSH SUBSCRIPTION
# ==================================================

@app.post("/push/subscribe")
def save_push_subscription(
    subscription: PushSubscription,
    current_user=Depends(get_current_user)
):

    subscription_data = {
        "endpoint": subscription.endpoint,
        "keys": {
            "p256dh": subscription.p256dh,
            "auth": subscription.auth
        }
    }

    users_collection.update_one(
        {
            "_id": ObjectId(
                current_user["sub"]
            )
        },
        {
            "$set": {
                "push_subscription": subscription_data
            }
        }
    )

    return {
        "message": "Push subscription saved successfully"
    }


# ==================================================
# TEST PUSH
# ==================================================

@app.post("/push/test")
def test_push(
    current_user=Depends(get_current_user)
):

    user = users_collection.find_one(
        {
            "_id": ObjectId(
                current_user["sub"]
            )
        }
    )

    if not user or "push_subscription" not in user:

        raise HTTPException(
            status_code=404,
            detail="Push subscription not found"
        )

    success = send_push_notification(
        subscription=user["push_subscription"],
        title="MediGuide AI 💊",
        body="Web Push notifications are working!",
        data={
            "type": "test"
        }
    )

    if not success:

        raise HTTPException(
            status_code=500,
            detail="Failed to send push notification"
        )

    return {
        "message": "Test push notification sent"
    }


# --------------------------------------------------
# CHAT SESSIONS
# --------------------------------------------------

@app.post("/chat/sessions")
def create_chat_session(
    session: ChatSessionCreate,
    current_user=Depends(get_current_user)
):
    now = datetime.now(timezone.utc)

    title = session.title.strip() if session.title else "New Chat"

    session_data = {
        "user_id": current_user["sub"],
        "title": title,
        "created_at": now,
        "updated_at": now
    }

    result = chat_sessions_collection.insert_one(session_data)

    return {
        "session_id": str(result.inserted_id),
        "title": title,
        "created_at": now,
        "updated_at": now
    }


@app.get("/chat/sessions")
def get_chat_sessions(
    current_user=Depends(get_current_user)
):
    sessions = list(
        chat_sessions_collection.find(
            {
                "user_id": current_user["sub"]
            },
            {
                "_id": 1,
                "title": 1,
                "created_at": 1,
                "updated_at": 1
            }
        ).sort("updated_at", -1)
    )

    result = []

    for session in sessions:
        result.append({
            "session_id": str(session["_id"]),
            "title": session.get("title", "New Chat"),
            "created_at": session.get("created_at"),
            "updated_at": session.get("updated_at")
        })

    return result


@app.get("/chat/sessions/{session_id}/messages")
def get_chat_messages(
    session_id: str,
    current_user=Depends(get_current_user)
):
    if not ObjectId.is_valid(session_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid session ID"
        )

    session = chat_sessions_collection.find_one(
        {
            "_id": ObjectId(session_id),
            "user_id": current_user["sub"]
        }
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    messages = list(
        chat_messages_collection.find(
            {
                "session_id": session_id,
                "user_id": current_user["sub"]
            },
            {
                "_id": 1,
                "sender": 1,
                "message_text": 1,
                "language": 1,
                "timestamp": 1
            }
        ).sort("timestamp", 1)
    )

    result = []

    for message in messages:
        result.append({
            "message_id": str(message["_id"]),
            "sender": message.get("sender"),
            "message_text": message.get("message_text"),
            "language": message.get("language"),
            "timestamp": message.get("timestamp")
        })

    return {
        "session_id": session_id,
        "messages": result
    }


@app.delete("/chat/sessions/{session_id}")
def delete_chat_session(
    session_id: str,
    current_user=Depends(get_current_user)
):
    if not ObjectId.is_valid(session_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid session ID"
        )

    session = chat_sessions_collection.find_one(
        {
            "_id": ObjectId(session_id),
            "user_id": current_user["sub"]
        }
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    chat_messages_collection.delete_many(
        {
            "session_id": session_id,
            "user_id": current_user["sub"]
        }
    )

    chat_sessions_collection.delete_one(
        {
            "_id": ObjectId(session_id),
            "user_id": current_user["sub"]
        }
    )

    return {
        "message": "Chat session deleted successfully"
    }