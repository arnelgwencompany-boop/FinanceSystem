from django.db import models
from transaction.models import Transaction
from django.conf import settings 
# Create your models here.
class Receipt(models.Model):
    transaction = models.ForeignKey('transaction.Transaction', on_delete=models.CASCADE)

    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    file = models.FileField(upload_to="receipts/")
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Review'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ],
        default='pending'
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='reviewed_receipts'
        
    )

    review_notes = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)