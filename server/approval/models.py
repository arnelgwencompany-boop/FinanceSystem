from django.db import models
from django.conf import settings 

# Create your models here.
class Approval(models.Model):
    ROLE_CHOICES = [
        ('supervisor', 'Supervisor'),
        ('director', 'Director'),
        ('finance', 'Finance'),
        ('admin', 'Admin'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    request = models.ForeignKey(
        'request.Request',
        on_delete=models.CASCADE,
        related_name="approvals"
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    signed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approvals_signed"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    signed_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('request', 'role')
        ordering = ['order']
        indexes = [
            models.Index(fields=['request', 'order']),
        ]

    def __str__(self):
        return f"{self.request} - {self.role} - {self.status}"

    @property
    def is_pending(self):
        return self.status == "pending"

    def is_next(self):
        previous = Approval.objects.filter(
            request=self.request,
            order__lt=self.order
        )
        return not previous.exclude(status="approved").exists()