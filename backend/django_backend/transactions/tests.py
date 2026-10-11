
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from accounts.models import User


class TransactionRBACTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            username="testadmin",
            email="testadmin@example.com",
            password="TestPassword123",
            role="admin",
        )
        self.support = User.objects.create_user(
            username="testsupport",
            email="support@example.com",
            password="TestPassword123",
            role="support",
        )
        self.read_only = User.objects.create_user(
            username="testreadonly",
            email="readonly@example.com",
            password="TestPassword123",
            role="read_only",
        )
        self.customer = User.objects.create_user(
            username="testcustomer",
            email="customer@example.com",
            password="TestPassword123",
            role="customer",
        )

    def test_admin_can_access_admin_dashboard(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("admin-dashboard"))
        self.assertEqual(response.status_code, 200)

    def test_support_cannot_access_admin_dashboard(self):
        self.client.force_authenticate(user=self.support)
        response = self.client.get(reverse("admin-dashboard"))
        self.assertEqual(response.status_code, 403)

    def test_read_only_cannot_access_admin_dashboard(self):
        self.client.force_authenticate(user=self.read_only)
        response = self.client.get(reverse("admin-dashboard"))
        self.assertEqual(response.status_code, 403)

    def test_customer_cannot_access_admin_dashboard(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.get(reverse("admin-dashboard"))
        self.assertEqual(response.status_code, 403)

    def test_unauthenticated_user_cannot_list_transactions(self):
        response = self.client.get(reverse("transaction-list"))
        self.assertEqual(response.status_code, 401)
