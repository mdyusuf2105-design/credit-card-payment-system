import random
import os
import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db
from models import Payment, Transaction
from schemas import PaymentCreate, PaymentResponse

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


def send_payment_notification(to_email, subject, message):
    if not to_email:
        return

    print("\n========== PAYMENT EMAIL ==========")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(message)
    print("===================================\n")

    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = os.getenv(
            "DEFAULT_FROM_EMAIL",
            "noreply@example.com"
        )
        msg["To"] = to_email
        msg.set_content(message)

        host = os.getenv("EMAIL_HOST")
        port = int(os.getenv("EMAIL_PORT", "587"))
        username = os.getenv("EMAIL_HOST_USER")
        password = os.getenv("EMAIL_HOST_PASSWORD")

        if host and username and password:
            with smtplib.SMTP(host, port) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(msg)

    except Exception as e:
        print(f"Email sending error: {e}")


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

    # Email alert when transaction exceeds ₹5000
    if payment.status == "SUCCESS" and payment.amount > 5000:
        result = db.execute(
            text("""
                SELECT email
                FROM accounts_user
                WHERE id = :user_id
            """),
            {"user_id": payment.user_id}
        ).fetchone()

        if result:
            send_payment_notification(
                result[0],
                "High Value Transaction Alert",
                f"""
A high-value transaction was detected.

Transaction Amount: ₹{payment.amount}
Status: {payment.status}

If you did not authorize this transaction, please contact your bank immediately.
"""
            )
    # Email alert when available credit falls below 10%
    if payment.status == "SUCCESS":
        credit_result = db.execute(
            text("""
                SELECT
                    c.credit_limit,
                    COALESCE(
                        (
                            SELECT SUM(t.amount)
                            FROM transactions_transaction t
                            JOIN payments p ON p.id = t.payment_id
                            WHERE p.card_id = c.id
                              AND t.status = 'SUCCESS'
                        ),
                        0
                    ) AS total_spent
                FROM cards_card c
                WHERE c.id = :card_id
            """),
            {"card_id": payment.card_id}
        ).fetchone()

        if credit_result:
            credit_limit = float(credit_result[0])
            total_spent = float(credit_result[1])
            available_credit = credit_limit - total_spent

            if available_credit <= credit_limit * 0.10:
                result = db.execute(
                    text("""
                        SELECT email
                        FROM accounts_user
                        WHERE id = :user_id
                    """),
                    {"user_id": payment.user_id}
                ).fetchone()

                if result:
                    send_payment_notification(
                        result[0],
                        "Low Credit Limit Alert",
                        f"""
Your available credit limit has fallen below 10%.

Credit Limit: ₹{credit_limit:.2f}
Total Spent: ₹{total_spent:.2f}
Available Credit: ₹{available_credit:.2f}

Please review your credit card usage.
"""
                    )
    return payment