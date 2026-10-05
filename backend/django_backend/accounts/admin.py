from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        'id',
        'username',
        'email',
        'role',
        'is_active',
        'date_joined',
    )

    list_filter = (
        'role',
        'is_active',
        'date_joined',
    )

    search_fields = (
        'username',
        'email',
    )