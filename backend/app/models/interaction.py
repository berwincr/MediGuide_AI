from pydantic import BaseModel, Field


class DrugInteractionRequest(BaseModel):
    medicines: list[str] = Field(
        ...,
        min_length=2
    )