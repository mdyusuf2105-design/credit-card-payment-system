from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    user_id: int
    card_id: int
    amount: Decimal = Field(gt=0)
    category: str = Field(default="Other", min_length=1, max_length=100)
    location: Optional[str] = Field(default=None, max_length=255)
    device_id: Optional[str] = Field(default=None, max_length=255)


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    card_id: int
    amount: Decimal
    status: str
    category: str = "Other"