from django.contrib import admin
from django.http import HttpResponse
from django.urls import path
from django.utils import timezone
from django.db.models import Count, Sum

import csv

from .models import Transaction, AdminLog


def export_transactions_csv(modeladmin, request, queryset):
    response = HttpResponse(
        content_type='text/csv'
    )

    response['Content-Disposition'] = (
        'attachment; filename="transactions.csv"'
    )

    writer = csv.writer(response)

    writer.writerow([
        'ID',
        'Username',
        'Payment ID',
        'Amount',
        'Status',
        'Created At',
    ])

    for transaction in queryset:
        writer.writerow([
            transaction.id,
            transaction.user.username,
            transaction.payment_id,
            transaction.amount,
            transaction.status,
            transaction.created_at,
        ])

    return response


export_transactions_csv.short_description = (
    "Export selected transactions to CSV"
)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'payment_id',
        'amount',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'created_at',
    )

    search_fields = (
        'user__username',
        'payment_id',
    )

    ordering = ('-created_at',)

    actions = [
        export_transactions_csv
    ]

    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                'daily-summary/',
                self.admin_site.admin_view(
                    self.daily_summary
                ),
                name='transaction-daily-summary',
            ),
        ]

        return custom_urls + urls

    def daily_summary(self, request):
        today = timezone.localdate()

        transactions = Transaction.objects.filter(
            created_at__date=today
        )

        total_transactions = transactions.count()

        successful = transactions.filter(
            status='SUCCESS'
        )

        failed = transactions.filter(
            status='FAILED'
        )

        pending = transactions.filter(
            status='PENDING'
        )

        successful_amount = (
            successful.aggregate(
                total=Sum('amount')
            )['total'] or 0
        )

        html = f"""
        <html>
        <head>
            <title>Daily Payment Summary</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    background: #f5f5f5;
                }}

                .container {{
                    max-width: 700px;
                    margin: auto;
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                }}

                h1 {{
                    margin-bottom: 25px;
                }}

                .card {{
                    padding: 18px;
                    margin: 12px 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }}

                .value {{
                    font-size: 24px;
                    font-weight: bold;
                }}
            </style>
        </head>

        <body>
            <div class="container">

                <h1>Daily Payment Summary</h1>

                <p>
                    Date: <strong>{today}</strong>
                </p>

                <div class="card">
                    Total Transactions
                    <div class="value">
                        {total_transactions}
                    </div>
                </div>

                <div class="card">
                    Successful Payments
                    <div class="value">
                        {successful.count()}
                    </div>
                </div>

                <div class="card">
                    Failed Payments
                    <div class="value">
                        {failed.count()}
                    </div>
                </div>

                <div class="card">
                    Pending Payments
                    <div class="value">
                        {pending.count()}
                    </div>
                </div>

                <div class="card">
                    Total Successful Amount
                    <div class="value">
                        ₹{successful_amount}
                    </div>
                </div>

            </div>
        </body>
        </html>
        """

        return HttpResponse(html)

@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ("id", "admin", "action", "created_at")
    list_filter = ("created_at",)
    search_fields = ("admin__username", "action")
    ordering = ("-created_at",)