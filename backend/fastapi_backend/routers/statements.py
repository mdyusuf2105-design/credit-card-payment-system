from io import BytesIO
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from routers.dashboard import get_current_user_id


router = APIRouter(
    prefix="/statements",
    tags=["Statements"],
)


@router.get("/monthly")
def monthly_statement(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    start_date = f"{year:04d}-{month:02d}-01"

    if month == 12:
        end_date = f"{year + 1:04d}-01-01"
    else:
        end_date = f"{year:04d}-{month + 1:02d}-01"

    user = db.execute(
        text("""
            SELECT username, email
            FROM accounts_user
            WHERE id = :user_id
        """),
        {"user_id": user_id},
    ).mappings().first()

    if not user:
        return {"detail": "User not found"}

    transactions = db.execute(
        text("""
            SELECT
                t.created_at,
                t.amount,
                t.status,
                COALESCE(
                    c.masked_card,
                    '**** **** **** ****'
                ) AS masked_card
            FROM transactions_transaction t
            LEFT JOIN payments p
                ON p.id = t.payment_id
            LEFT JOIN cards_card c
                ON c.id = p.card_id
            WHERE t.user_id = :user_id
              AND t.created_at >= :start_date
              AND t.created_at < :end_date
            ORDER BY t.created_at ASC
        """),
        {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
        },
    ).mappings().all()

    total_amount = sum(
        float(row["amount"] or 0)
        for row in transactions
        if row["status"] == "SUCCESS"
    )

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "StatementTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "StatementSubtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20,
    )

    right_style = ParagraphStyle(
        "Right",
        parent=styles["Normal"],
        alignment=TA_RIGHT,
        fontSize=10,
    )

    story = []

    story.append(
        Paragraph(
            "CREDIT CARD MONTHLY STATEMENT",
            title_style,
        )
    )

    story.append(
        Paragraph(
            f"{year:04d}-{month:02d}",
            subtitle_style,
        )
    )

    customer_data = [
        ["Customer", user["username"]],
        ["Email", user["email"]],
        [
            "Statement Period",
            f"{start_date} to {end_date}",
        ],
        [
            "Generated",
            datetime.now().strftime("%Y-%m-%d %H:%M"),
        ],
    ]

    customer_table = Table(
        customer_data,
        colWidths=[130, 370],
    )

    customer_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eeeeee")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])
    )

    story.append(customer_table)
    story.append(Spacer(1, 20))

    summary_data = [
        ["Successful Transactions", str(
            sum(1 for row in transactions if row["status"] == "SUCCESS")
        )],
        ["Total Successful Spending", f"₹{total_amount:,.2f}"],
        ["Total Transactions", str(len(transactions))],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[300, 200],
    )

    summary_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f7f7f7")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("ALIGN", (1, 0), (1, -1), "RIGHT"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])
    )

    story.append(summary_table)
    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "TRANSACTION DETAILS",
            styles["Heading2"],
        )
    )

    table_data = [
        ["Date", "Card", "Amount", "Status"]
    ]

    for row in transactions:
        date_value = row["created_at"]

        if isinstance(date_value, datetime):
            date_text = date_value.strftime("%Y-%m-%d")
        else:
            date_text = str(date_value)[:10]

        table_data.append([
            date_text,
            row["masked_card"],
            f"₹{float(row['amount']):,.2f}",
            row["status"],
        ])

    if len(table_data) == 1:
        table_data.append([
            "-",
            "-",
            "₹0.00",
            "No transactions",
        ])

    transaction_table = Table(
        table_data,
        colWidths=[85, 170, 100, 95],
        repeatRows=1,
    )

    transaction_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#222222")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
            ("ALIGN", (2, 1), (2, -1), "RIGHT"),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])
    )

    story.append(transaction_table)
    story.append(Spacer(1, 25))

    story.append(
        Paragraph(
            "This statement is generated electronically by the Credit Card Payment System.",
            subtitle_style,
        )
    )

    doc.build(story)

    buffer.seek(0)

    filename = f"monthly_statement_{year}_{month:02d}.pdf"

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )
