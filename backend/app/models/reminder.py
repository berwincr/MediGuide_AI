from pydantic import BaseModel
from typing import Optional


class ReminderRequest(BaseModel):
    medicine_name: str
    rx_cui: Optional[str] = None
    dosage: str
    frequency: str
    time: str
    start_date: str
    end_date: Optional[str] = None
    notes: Optional[str] = ""

class PushSubscription(BaseModel):
    endpoint: str
    p256dh: str
    auth: str