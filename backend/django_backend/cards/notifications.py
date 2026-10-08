from django.core.mail import send_mail
from django.conf import settings


def send_card_notification(to_email, subject, message):
    if not to_email:
        return

    print("\n========== EMAIL NOTIFICATION ==========")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(message)
    print("========================================\n")

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Email sending error: {e}")