from pydantic import BaseModel
from typing import List, Optional


class Medicine(BaseModel):
    name: str
    generic_name: Optional[str] = None
    rxnorm_cui: Optional[str] = None
    drugbank_id: Optional[str] = None
    brand_names: List[str] = []
    source: List[str] = []