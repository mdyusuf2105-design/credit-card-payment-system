from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Card
from .serializers import CardSerializer
from .notifications import send_card_notification

class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CardDeleteView(generics.DestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(
            user=self.request.user
        )

from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from decimal import Decimal


class AdminCardManagementView(APIView):
    permission_classes = [IsAdminUser]

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

            columns = [col[0] for col in cursor.description]
            cards = [dict(zip(columns, row)) for row in cursor.fetchall()]

        for card in cards:
            card["credit_limit"] = float(card["credit_limit"])
            card["total_activity"] = float(card["total_activity"])
            card["created_at"] = card["created_at"].isoformat()

        return Response(cards)


class AdminCardUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        is_blocked = request.data.get("is_blocked")
        credit_limit = request.data.get("credit_limit")

        # Get card owner email and masked card
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.email, c.masked_card
                FROM accounts_user u
                JOIN cards_card c ON c.user_id = u.id
                WHERE c.id = %s
                """,
                [pk]
            )
            card_info = cursor.fetchone()

        if not card_info:
            return Response(
                {"error": "Card not found"},
                status=404
            )

        user_email, masked_card = card_info

        updates = []
        params = []

        if is_blocked is not None:
            updates.append("is_blocked = %s")
            params.append(bool(is_blocked))

        if credit_limit is not None:
            try:
                credit_limit = Decimal(str(credit_limit))

                if credit_limit <= 0:
                    return Response(
                        {"error": "Credit limit must be greater than 0"},
                        status=400
                    )

            except Exception:
                return Response(
                    {"error": "Invalid credit limit"},
                    status=400
                )

            updates.append("credit_limit = %s")
            params.append(credit_limit)

        if not updates:
            return Response(
                {"error": "Provide is_blocked or credit_limit"},
                status=400
            )

        params.append(pk)

        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                UPDATE cards_card
                SET {", ".join(updates)}
                WHERE id = %s
                """,
                params
            )

        # Email when card is blocked
        # Check the actual saved card status
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT is_blocked FROM cards_card WHERE id = %s",
                [pk]
            )
            status_row = cursor.fetchone()

        if status_row and status_row[0]:
            send_card_notification(
                user_email,
                "Credit Card Blocked",
                f"""
        Your credit card {masked_card} has been blocked.

        If you believe this was done incorrectly, please contact the administrator.
        """
            )

        return Response({
            "message": "Card updated successfully"
        })