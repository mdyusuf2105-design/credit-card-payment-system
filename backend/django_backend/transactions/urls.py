
from django.urls import path
from .views import (
    TransactionListView,
    AdminDashboardView,
    TransactionCSVExportView,
)

urlpatterns = [
    path("", TransactionListView.as_view(), name="transaction-list"),
    path(
        "admin-dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),
    path(
        "export/csv/",
        TransactionCSVExportView.as_view(),
        name="transaction-export-csv",
    ),
]
