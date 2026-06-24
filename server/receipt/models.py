from django.db import models
from transaction.models import Transaction
# Create your models here.
class Receipt(models.Model):
    transaction = models.ForeignKey('transaction.Transaction', on_delete=models.CASCADE)

    file = models.FileField(upload_to="receipts/")
    uploaded_at = models.DateTimeField(auto_now_add=True)