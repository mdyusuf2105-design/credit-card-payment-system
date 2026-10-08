from django.urls import path

from .views import (
    CardListCreateView,
    CardDeleteView,
    AdminCardManagementView,
    AdminCardUpdateView,
)

urlpatterns = [
    path(
        '',
        CardListCreateView.as_view(),
        name='card-list-create'
    ),

    path(
        '<int:pk>/',
        CardDeleteView.as_view(),
        name='card-delete'
    ),

    path(
        'admin/',
        AdminCardManagementView.as_view(),
        name='admin-card-management'
    ),

    path(
        'admin/<int:pk>/',
        AdminCardUpdateView.as_view(),
        name='admin-card-update'
    ),
]