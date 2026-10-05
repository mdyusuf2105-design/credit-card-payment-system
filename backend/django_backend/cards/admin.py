from django.contrib import admin
from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'card_type',
        'masked_card',
        'last_four',
        'card_holder_name',
        'expiry_month',
        'expiry_year',
        'created_at',
    )

    list_filter = (
        'card_type',
        'created_at',
    )

    search_fields = (
        'user__username',
        'card_holder_name',
        'last_four',
    )

    ordering = ('-created_at',)