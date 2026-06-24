from django.db import models

# Create your models here.
# approvals/models.py
class Approval(models.Model):
    ROLE_CHOICES = [
        ('applicant', 'Applicant'),
        ('supervisor', 'Supervisor'),
        ('director', 'Director'),
        ('finance', 'Finance'),
    ]

    request = models.ForeignKey('requests.Request', on_delete=models.CASCADE, related_name="approvals")

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    signed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, default="pending")  # pending, approved, rejected