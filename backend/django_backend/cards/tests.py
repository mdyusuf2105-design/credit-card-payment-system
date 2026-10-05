from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User
from cards.models import Card


class CardTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="carduser",
            email="card@example.com",
            password="TestPassword123",
        )

        self.client.force_authenticate(user=self.user)

    def test_add_card(self):
        response = self.client.post(
            reverse("card-list-create"),
            {
                "card_type": "credit",
                "card_number": "4111111111111111",
                "cvv": "123",
                "card_holder_name": "Test User",
                "expiry_month": 12,
                "expiry_year": 2030,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Card.objects.count(), 1)

    def test_card_number_is_not_stored(self):
        self.client.post(
            reverse("card-list-create"),
            {
                "card_type": "credit",
                "card_number": "4111111111111111",
                "cvv": "123",
                "card_holder_name": "Test User",
                "expiry_month": 12,
                "expiry_year": 2030,
            },
            format="json",
        )

        card = Card.objects.first()

        self.assertEqual(card.last_four, "1111")
        self.assertNotIn(
            "4111111111111111",
            str(card.__dict__)
        )