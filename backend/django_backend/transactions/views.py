from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum
from django.utils import timezone

from .models import AdminLog, Transaction
from .serializers import TransactionSerializer


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

        status = self.request.query_params.get('status')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if status:
            queryset = queryset.filter(status=status.upper())

        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)

        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)

        if start_date:
            queryset = queryset.filter(
                created_at__date__gte=start_date
            )

        if end_date:
            queryset = queryset.filter(
                created_at__date__lte=end_date
            )

        return queryset

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        AdminLog.objects.create(
            admin=request.user,
            action="Viewed Admin Dashboard"
        )
        today = timezone.localdate()

        transactions = Transaction.objects.all()

        today_transactions = transactions.filter(
            created_at__date=today
        )

        successful = transactions.filter(status="SUCCESS")
        failed = transactions.filter(status="FAILED")
        pending = transactions.filter(status="PENDING")

        successful_amount = (
            successful.aggregate(total=Sum("amount"))["total"] or 0
        )

        return Response({
            "total_transactions": transactions.count(),
            "successful_transactions": successful.count(),
            "failed_transactions": failed.count(),
            "pending_transactions": pending.count(),
            "successful_amount": successful_amount,
            "today_transactions": today_transactions.count(),
        })