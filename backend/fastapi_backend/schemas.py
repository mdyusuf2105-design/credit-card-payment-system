from pydantic import BaseModel, Field
from decimal import Decimal


class PaymentCreate(BaseModel):
    user_id: int
    card_id: int
    amount: Decimal = Field(gt=0)


class PaymentResponse(BaseModel):
    id: int
    user_id: int
    card_id: int
    amount: Decimal
    status: str

    class Config:
        from_attributes = True