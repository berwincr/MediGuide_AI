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
    endpoint: str                                                  #Endpoint url that the backend can use to send push notifications
    p256dh: str                                                    #Web Push subscription cryptographic information
    auth: str