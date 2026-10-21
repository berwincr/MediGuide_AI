from pydantic import BaseModel, Field
from typing import Optional


class SymptomItem(BaseModel):
    name: str = Field(..., min_length=1)
    severity: int = Field(..., ge=1, le=10)


class SymptomRecordRequest(BaseModel):
    symptoms: list[SymptomItem] = Field(..., min_length=1)
    onset_date: Optional[str] = None
    notes: Optional[str] = None

class SymptomTextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    severity: int = Field(..., ge=1, le=10)
    onset_date: Optional[str] = None
    notes: Optional[str] = None
    