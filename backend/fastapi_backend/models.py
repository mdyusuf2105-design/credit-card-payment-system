from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    Numeric,
    String,
)

from database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    card_id = Column(Integer, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100), nullable=False, default="Other")
    status = Column(String(20), default="PENDING", nullable=False)
    location = Column(String(255), nullable=True)
    device_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions_transaction"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    payment_id = Column(Integer, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False)
    location = Column(String(255), nullable=True)
    device_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    is_fraud = Column(Boolean, default=False, nullable=False)
    fraud_reason = Column(String(255), nullable=True)


class FraudLog(Base):
    __tablename__ = "fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    payment_id = Column(Integer, nullable=True)
    transaction_id = Column(Integer, nullable=True)
    reason = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)