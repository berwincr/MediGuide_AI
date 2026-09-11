from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    language: str = "en"
    session_id: Optional[str] = None


class ChatSessionCreate(BaseModel):
    title: Optional[str] = None


class ChatMessageCreate(BaseModel):
    session_id: str
    message_text: str = Field(..., min_length=1)
    language: str = "en"