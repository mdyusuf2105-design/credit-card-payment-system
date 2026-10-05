import sys
from pathlib import Path
from decimal import Decimal

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_create_payment():
    response = client.post(
        "/payments/",
        json={
            "user_id": 1,
            "card_id": 2,
            "amount": 500.00,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["user_id"] == 1
    assert data["card_id"] == 2
    assert Decimal(str(data["amount"])) == Decimal("500.00")
    assert data["status"] == "PENDING"


def test_payment_amount_must_be_positive():
    response = client.post(
        "/payments/",
        json={
            "user_id": 1,
            "card_id": 2,
            "amount": 0,
        },
    )

    assert response.status_code == 422


def test_process_payment():
    create_response = client.post(
        "/payments/",
        json={
            "user_id": 1,
            "card_id": 2,
            "amount": 250.00,
        },
    )

    assert create_response.status_code == 200

    payment_id = create_response.json()["id"]

    process_response = client.post(
        f"/payments/{payment_id}/process"
    )

    assert process_response.status_code == 200

    data = process_response.json()

    assert data["id"] == payment_id
    assert data["status"] in ["SUCCESS", "FAILED"]


def test_process_nonexistent_payment():
    response = client.post("/payments/999999/process")

    assert response.status_code == 404
