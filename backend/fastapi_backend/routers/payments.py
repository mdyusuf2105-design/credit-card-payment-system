
import os
import random
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from models import Payment, Transaction, FraudLog
from schemas import PaymentCreate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["Payments"])

HIGH_VALUE_LIMIT = 5000
FRAUD_WINDOW_MINUTES = 10


def send_payment_notification(to_email, subject, message):
    print(f"\n========== EMAIL: {subject} ==========")
    print(f"To: {to_email or 'No email configured'}")
    print(message)
    print("======================================\n")

    if not to_email:
        return

    try:
        host = os.getenv("EMAIL_HOST")
        username = os.getenv("EMAIL_HOST_USER")
        password = os.getenv("EMAIL_HOST_PASSWORD")
        port = int(os.getenv("EMAIL_PORT", "587"))

        if not (host and username and password):
            return

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = os.getenv(
            "DEFAULT_FROM_EMAIL", username
        )
        msg["To"] = to_email
        msg.set_content(message)

        with smtplib.SMTP(host, port, timeout=10) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)

    except Exception as exc:
        print(f"Email sending error: {exc}")


def get_user_email(db, user_id):
    result = db.execute(
        text("SELECT email FROM accounts_user WHERE id = :user_id"),
        {"user_id": user_id},
    ).fetchone()
    return result[0] if result else None


def evaluate_fraud(db, payment, transaction):
    cutoff = datetime.utcnow() - timedelta(
        minutes=FRAUD_WINDOW_MINUTES
    )

    reasons = []

    if float(payment.amount) >= HIGH_VALUE_LIMIT:
        previous_high_value = (
            db.query(Transaction)
            .filter(
                Transaction.user_id == payment.user_id,
                Transaction.id != transaction.id,
                Transaction.amount >= HIGH_VALUE_LIMIT,
                Transaction.created_at >= cutoff,
            )
            .count()
        )

        if previous_high_value >= 1:
            reasons.append(
                "Repeated high-value transactions within "
                f"{FRAUD_WINDOW_MINUTES} minutes"
            )

    previous_transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == payment.user_id,
            Transaction.id != transaction.id,
            Transaction.created_at >= cutoff,
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )

    if payment.location:
        for previous in previous_transactions:
            if (
                previous.location
                and previous.location != payment.location
            ):
                reasons.append(
                    "Different transaction locations within "
                    f"{FRAUD_WINDOW_MINUTES} minutes"
                )
                break

    if payment.device_id:
        for previous in previous_transactions:
            if (
                previous.device_id
                and previous.device_id != payment.device_id
            ):
                reasons.append(
                    "Different devices used within "
                    f"{FRAUD_WINDOW_MINUTES} minutes"
                )
                break

    if not reasons:
        return None

    reason = "; ".join(dict.fromkeys(reasons))[:255]

    transaction.is_fraud = True
    transaction.fraud_reason = reason

    db.add(
        FraudLog(
            user_id=payment.user_id,
            payment_id=payment.id,
            transaction_id=transaction.id,
            reason=reason,
        )
    )
    db.commit()
    db.refresh(transaction)

    send_payment_notification(
        get_user_email(db, payment.user_id),
        "Fraud Alert: Suspicious Transaction Activity",
        f"Payment ID: {payment.id}\n"
        f"Transaction ID: {transaction.id}\n"
        f"Amount: ₹{float(payment.amount):.2f}\n"
        f"Reason: {reason}",
    )

    return reason


@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
):
    category = (
        getattr(payment_data, "category", None) or "Other"
    ).strip()[:100] or "Other"

    payment = Payment(
        user_id=payment_data.user_id,
        card_id=payment_data.card_id,
        amount=payment_data.amount,
        category=category,
        location=getattr(payment_data, "location", None),
        device_id=getattr(payment_data, "device_id", None),
        status="PENDING",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.post("/{payment_id}/process", response_model=PaymentResponse)
def process_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found.",
        )

    if payment.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Payment has already been processed.",
        )

    payment.status = random.choice(["SUCCESS", "FAILED"])

    transaction = Transaction(
        user_id=payment.user_id,
        payment_id=payment.id,
        amount=payment.amount,
        status=payment.status,
        location=payment.location,
        device_id=payment.device_id,
        is_fraud=False,
        fraud_reason=None,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    db.refresh(payment)

    if payment.status == "SUCCESS":
        if float(payment.amount) > HIGH_VALUE_LIMIT:
            send_payment_notification(
                get_user_email(db, payment.user_id),
                "High Value Transaction Alert",
                f"Transaction amount: ₹{float(payment.amount):.2f}\n"
                f"Status: {payment.status}",
            )

        evaluate_fraud(db, payment, transaction)

        credit_result = db.execute(
            text("""
                SELECT c.credit_limit,
                       COALESCE((
                           SELECT SUM(t.amount)
                           FROM transactions_transaction t
                           JOIN payments p ON p.id = t.payment_id
                           WHERE p.card_id = c.id
                             AND t.status = 'SUCCESS'
                       ), 0) AS total_spent
                FROM cards_card c
                WHERE c.id = :card_id
            """),
            {"card_id": payment.card_id},
        ).fetchone()

        if credit_result:
            credit_limit = float(credit_result[0])
            total_spent = float(credit_result[1])
            available_credit = credit_limit - total_spent

            if (
                credit_limit > 0
                and available_credit <= credit_limit * 0.10
            ):
                send_payment_notification(
                    get_user_email(db, payment.user_id),
                    "Low Credit Limit Alert",
                    f"Credit limit: ₹{credit_limit:.2f}\n"
                    f"Total spent: ₹{total_spent:.2f}\n"
                    f"Available credit: ₹{available_credit:.2f}",
                )

    return payment
