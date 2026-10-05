from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(
        write_only=True,
        min_length=13,
        max_length=19
    )

    cvv = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=4
    )

    class Meta:
        model = Card
        fields = [
            'id',
            'card_type',
            'card_number',
            'cvv',
            'card_holder_name',
            'expiry_month',
            'expiry_year',
            'masked_card',
            'last_four',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'masked_card',
            'last_four',
            'created_at',
        ]

    def validate_card_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "Card number must contain only digits."
            )

        return value

    def validate_cvv(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "CVV must contain only digits."
            )

        return value

    def create(self, validated_data):
        card_number = validated_data.pop('card_number')
        validated_data.pop('cvv')

        last_four = card_number[-4:]

        masked_card = f"**** **** **** {last_four}"

        card = Card.objects.create(
            masked_card=masked_card,
            last_four=last_four,
            **validated_data
        )

        return card