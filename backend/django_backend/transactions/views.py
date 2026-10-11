import csv

from django.db import connection
from django.db.models import Sum
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminRole
from .models import AdminLog, Transaction
from .serializers import TransactionSerializer


class TransactionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TransactionPagination


    def get_queryset(self):
        user = self.request.user

        if user.role in ("admin", "support", "read_only"):
            queryset = Transaction.objects.all()
        else:
            queryset = Transaction.objects.filter(user=user)

        params = self.request.query_params

        status_value = params.get("status")
        min_amount = params.get("min_amount")
        max_amount = params.get("max_amount")
        start_date = params.get("start_date")
        end_date = params.get("end_date")
        masked_card = params.get("masked_card")
        ordering = params.get("ordering", "-created_at")

        if status_value:
            queryset = queryset.filter(status__iexact=status_value)

        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)

        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)

        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)

        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        masked_card = self.request.query_params.get("masked_card")
        if masked_card:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id
                    FROM payments
                    WHERE card_id IN (
                        SELECT id
                        FROM cards_card
                        WHERE masked_card LIKE %s
                    )
                    """,
                    [f"%{masked_card}%"],
                )
                payment_ids = [row[0] for row in cursor.fetchall()]

            queryset = queryset.filter(payment_id__in=payment_ids)

        allowed_ordering = {
            "created_at", "-created_at",
            "amount", "-amount",
            "status", "-status",
        }

        if ordering not in allowed_ordering:
            ordering = "-created_at"

        return queryset.order_by(ordering, "-id").select_related("user")
