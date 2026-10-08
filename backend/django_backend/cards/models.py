from django.conf import settings
from django.db import models


class Card(models.Model):
    CARD_TYPE_CHOICES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cards'
    )

    card_type = models.CharField(
        max_length=10,
        choices=CARD_TYPE_CHOICES
    )

    masked_card = models.CharField(
        max_length=19
    )

    last_four = models.CharField(
        max_length=4
    )

    card_holder_name = models.CharField(
        max_length=100
    )

    credit_limit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=500000
    )

    is_blocked = models.BooleanField(default=False)
    
    expiry_month = models.PositiveSmallIntegerField()

    expiry_year = models.PositiveSmallIntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.card_type} **** {self.last_four}"