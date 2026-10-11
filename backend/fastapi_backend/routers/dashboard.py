
import os
from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from jose import jwt, JWTError
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_current_user_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    secret_key = os.getenv("DJANGO_SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=500, detail="JWT secret is not configured")

    try:
        payload = jwt.decode(
            authorization.split(" ", 1)[1],
            secret_key,
            algorithms=["HS256"],
        )
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid JWT: user_id missing")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired JWT token")


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    totals = db.execute(
        text("""
            SELECT COUNT(*) AS total_transactions,
                   COALESCE(SUM(amount), 0) AS total_amount_spent
            FROM transactions_transaction
            WHERE user_id = :user_id
        """),
        {"user_id": user_id},
    ).mappings().first()

    current_month = db.execute(
        text("""
            SELECT COALESCE(SUM(amount), 0) AS current_month_spending
            FROM transactions_transaction
            WHERE user_id = :user_id
              AND status = 'SUCCESS'
              AND YEAR(created_at) = YEAR(CURDATE())
              AND MONTH(created_at) = MONTH(CURDATE())
        """),
        {"user_id": user_id},
    ).mappings().first()

    last_5 = db.execute(
        text("""
            SELECT t.amount, t.status, t.created_at AS date,
                   COALESCE(c.masked_card, '**** **** **** ****')
                       AS masked_card_number
            FROM transactions_transaction t
            LEFT JOIN payments p ON p.id = t.payment_id
            LEFT JOIN cards_card c ON c.id = p.card_id
            WHERE t.user_id = :user_id
            ORDER BY t.created_at DESC
            LIMIT 5
        """),
        {"user_id": user_id},
    ).mappings().all()

    return {
        "total_transactions": totals["total_transactions"],
        "total_amount_spent": float(totals["total_amount_spent"] or 0),
        "current_month_spending": float(
            current_month["current_month_spending"] or 0
        ),
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


@router.get("/monthly-spending")
def monthly_spending(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    rows = db.execute(
        text("""
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                   SUM(amount) AS spending
            FROM transactions_transaction
            WHERE user_id = :user_id AND status = 'SUCCESS'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month
        """),
        {"user_id": user_id},
    ).mappings().all()

    return [
        {"month": row["month"], "spending": float(row["spending"] or 0)}
        for row in rows
    ]



@router.get("/category-expenses")
def category_expenses(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    rows = db.execute(
        text("""
            SELECT p.category AS category, SUM(t.amount) AS total
            FROM transactions_transaction t
            JOIN payments p ON p.id = t.payment_id
            WHERE t.user_id = :user_id
              AND t.status = 'SUCCESS'
            GROUP BY p.category
            ORDER BY total DESC
        """),
        {"user_id": user_id},
    ).fetchall()

    return [
        {"category": row[0] or "Other", "total": float(row[1] or 0)}
        for row in rows
    ]



@router.get("/credit-utilization")
def credit_utilization(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    rows = db.execute(
        text("""
            SELECT c.id AS card_id,
                   c.masked_card,
                   c.credit_limit,
                   COALESCE(SUM(
                       CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END
                   ), 0) AS total_spent
            FROM cards_card c
            LEFT JOIN payments p ON p.card_id = c.id
            LEFT JOIN transactions_transaction t ON t.payment_id = p.id
            WHERE c.user_id = :user_id
            GROUP BY c.id, c.masked_card, c.credit_limit
            ORDER BY c.id
        """),
        {"user_id": user_id},
    ).mappings().all()

    result = []
    for row in rows:
        limit = float(row["credit_limit"] or 0)
        spent = float(row["total_spent"] or 0)
        result.append({
            "card_id": row["card_id"],
            "masked_card": row["masked_card"],
            "credit_limit": limit,
            "total_spent": spent,
            "available_credit": max(limit - spent, 0),
            "utilization_percent": round(spent / limit * 100, 2) if limit > 0 else 0,
        })

    return result
