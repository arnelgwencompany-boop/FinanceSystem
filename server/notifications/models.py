from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("request_created", "Request Created"),
        ("approved_supervisor", "Approved by Supervisor"),
        ("approved_director", "Approved by Director"),
        ("approved_finance", "Approved by Finance"),
        ("rejected", "Rejected"),
        ("cash_released", "Cash Released"),
        ("receipt_uploaded", "Receipt Uploaded"),
        ("receipt_approved", "Receipt Approved"),
        ("admin_review", "Admin Review"),
    ]

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_notifications"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_notifications"
    )

    # Link to request
    request = models.ForeignKey(
        "request.Request",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)
    message = models.TextField()

    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.username} - {self.notification_type}"
    
# create sample 
# Notification.objects.create(
#     recipient=supervisor,
#     sender=employee,
#     request=req,
#     notification_type="request_created",
#     title="New Request",
#     message="A new request needs your approval"
# )

# Notification.objects.create(
#     recipient=director,
#     sender=supervisor,
#     request=req,
#     notification_type="approved_supervisor",
#     title="Supervisor Approved",
#     message="Request needs director approval"
# )

# Notification.objects.create(
#     recipient=finance,
#     sender=director,
#     request=req,
#     notification_type="approved_director",
#     title="Director Approved",
#     message="Ready for finance processing"
# )

# Notification.objects.create(
#     recipient=employee,
#     sender=finance,
#     request=req,
#     notification_type="cash_released",
#     title="Cash Released",
#     message="Your cash is ready"
# )

# Notification.objects.create(
#     recipient=finance,
#     sender=employee,
#     request=req,
#     notification_type="receipt_uploaded",
#     title="Receipt Uploaded",
#     message="Please review receipt"
# )

# Notification.objects.create(
#     recipient=admin,
#     sender=finance,
#     request=req,
#     notification_type="receipt_approved",
#     title="Receipt Approved",
#     message="Ready for admin review"
# )