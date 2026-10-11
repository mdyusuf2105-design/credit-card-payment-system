
from decimal import Decimal

from django.db import connection
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import (
    CanViewOperations,
    IsAdminRole,
    IsCustomerForOwnCards,
)
from transactions.models import AdminLog

from .models import Card
from .serializers import CardSerializer
from .notifications import send_card_notification


class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsCustomerForOwnCards]

    def get_queryset(self):
        return Card.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CardDeleteView(generics.DestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsCustomerForOwnCards]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)


class AdminCardManagementView(APIView):
    permission_classes = [CanViewOperations]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    c.id,
                    u.email,
                    c.card_type,
                    c.masked_card,
                    c.card_holder_name,
                    c.credit_limit,
                    c.is_blocked,
                    c.created_at,
                    COUNT(t.id) AS transaction_count,
                    COALESCE(SUM(t.amount), 0) AS total_activity
                FROM cards_card c
                JOIN accounts_user u ON u.id = c.user_id
                LEFT JOIN payments p ON p.card_id = c.id
                LEFT JOIN transactions_transaction t ON t.payment_id = p.id
                GROUP BY
                    c.id, u.email, c.card_type, c.masked_card,
                    c.card_holder_name, c.credit_limit,
                    c.is_blocked, c.created_at
                ORDER BY c.created_at DESC
            """)

            columns = [column[0] for column in cursor.description]
            cards = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]

        for card in cards:
            card["credit_limit"] = float(card["credit_limit"])
            card["total_activity"] = float(card["total_activity"])
            card["created_at"] = card["created_at"].isoformat()

        return Response(cards)


class AdminCardUpdateView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        is_blocked = request.data.get("is_blocked")
        credit_limit = request.data.get("credit_limit")

        if is_blocked is None and credit_limit is None:
            return Response(
                {"error": "Provide is_blocked or credit_limit"},
                status=400,
            )

        if is_blocked is not None and not isinstance(is_blocked, bool):
            return Response(
                {"error": "is_blocked must be true or false"},
                status=400,
            )

        if credit_limit is not None:
            try:
                credit_limit = Decimal(str(credit_limit))
                if not credit_limit.is_finite() or credit_limit <= 0:
                    raise ValueError
            except (ValueError, TypeError, ArithmeticError):
                return Response(
                    {"error": "Credit limit must be a valid number greater than 0"},
                    status=400,
                )

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.email, c.masked_card, c.is_blocked, c.credit_limit
                FROM accounts_user u
                JOIN cards_card c ON c.user_id = u.id
                WHERE c.id = %s
                """,
                [pk],
            )
            card_info = cursor.fetchone()

        if not card_info:
            return Response({"error": "Card not found"}, status=404)

        user_email, masked_card, old_is_blocked, old_credit_limit = card_info

        updates = []
        params = []
        actions = []

        if is_blocked is not None:
            updates.append("is_blocked = %s")
            params.append(is_blocked)
            if is_blocked != old_is_blocked:
                actions.append(
                    f"changed card {masked_card} is_blocked "
                    f"from {old_is_blocked} to {is_blocked}"
                )

        if credit_limit is not None:
            updates.append("credit_limit = %s")
            params.append(credit_limit)
            if credit_limit != old_credit_limit:
                actions.append(
                    f"changed card {masked_card} credit_limit "
                    f"from {old_credit_limit} to {credit_limit}"
                )

        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                UPDATE cards_card
                SET {", ".join(updates)}
                WHERE id = %s
                """,
                [*params, pk],
            )

        if actions:
            AdminLog.objects.create(
                admin=request.user,
                action="; ".join(actions),
            )

        if is_blocked is True and is_blocked != old_is_blocked:
            send_card_notification(
                user_email,
                "Credit Card Blocked",
                f"""
Your credit card {masked_card} has been blocked.

If you believe this was done incorrectly, please contact the administrator.
""",
            )

        return Response({"message": "Card updated successfully"})
