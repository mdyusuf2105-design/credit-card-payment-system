import os
from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from jose import jwt, JWTError
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_current_user_id(
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.split(" ", 1)[1]

    secret_key = os.getenv("DJANGO_SECRET_KEY")

    if not secret_key:
        raise HTTPException(
            status_code=500,
            detail="JWT secret is not configured"
        )

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=["HS256"]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid JWT: user_id missing"
            )

        return int(user_id)

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired JWT token"
        )


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    totals = db.execute(
        text("""
            SELECT
                COUNT(*) AS total_transactions,
                COALESCE(SUM(amount), 0) AS total_amount_spent
            FROM transactions_transaction
            WHERE user_id = :user_id
        """),
        {"user_id": user_id}
    ).mappings().first()

    current_month = db.execute(
        text("""
            SELECT
                COALESCE(SUM(amount), 0) AS current_month_spending
            FROM transactions_transaction
            WHERE user_id = :user_id
              AND YEAR(created_at) = YEAR(CURDATE())
              AND MONTH(created_at) = MONTH(CURDATE())
        """),
        {"user_id": user_id}
    ).mappings().first()

    last_5 = db.execute(
        text("""
            SELECT
                t.amount,
                t.status,
                t.created_at AS date,
                COALESCE(
                    c.masked_card,
                    '**** **** **** ****'
                ) AS masked_card_number
            FROM transactions_transaction t
            LEFT JOIN payments p
                ON p.id = t.payment_id
            LEFT JOIN cards_card c
                ON c.id = p.card_id
            WHERE t.user_id = :user_id
            ORDER BY t.created_at DESC
            LIMIT 5
        """),
        {"user_id": user_id}
    ).mappings().all()

    total_spent = float(
        totals["total_amount_spent"] or 0
    )

    # Current project does not have a credit_limit column.
    total_credit_limit = 500000

    available_credit = max(
        total_credit_limit - total_spent,
        0
    )

    return {
        "total_transactions": totals["total_transactions"],
        "total_amount_spent": total_spent,
        "current_month_spending": float(
            current_month["current_month_spending"] or 0
        ),
        "available_credit_limit": available_credit,
        "last_5_transactions": [
            {
                "amount": float(row["amount"]),
                "masked_card_number": row["masked_card_number"],
                "date": (
                    row["date"].isoformat()
                    if isinstance(row["date"], datetime)
                    else str(row["date"])
                ),
                "status": row["status"],
            }
            for row in last_5
        ],
    }