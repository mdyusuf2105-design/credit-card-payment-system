import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Payment, Transaction
from schemas import PaymentCreate, PaymentResponse

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db)
):
    payment = Payment(
        user_id=payment_data.user_id,
        card_id=payment_data.card_id,
        amount=payment_data.amount,
        status="PENDING"
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment

@router.post("/{payment_id}/process", response_model=PaymentResponse)
def process_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found."
        )

    if payment.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Payment has already been processed."
        )

    # Simulate payment success or failure
    payment.status = random.choice(["SUCCESS", "FAILED"])

    transaction = Transaction(
        user_id=payment.user_id,
        payment_id=payment.id,
        amount=payment.amount,
        status=payment.status,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    db.refresh(payment)

    return payment