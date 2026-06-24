from django.db import models
from django.conf import settings 

# Create your models here.
class Transaction(models.Model):
    request = models.OneToOneField('request.Request', on_delete=models.CASCADE)

    date = models.DateField()
    department = models.CharField(max_length=100)

    unit = models.IntegerField()
    item = models.IntegerField()

    description = models.TextField()

    payout = models.DecimalField(max_digits=12, decimal_places=2)
    vat = models.DecimalField(max_digits=12, decimal_places=2)
    without_vat = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2)

    balance = models.DecimalField(max_digits=12, decimal_places=2)

    category = models.CharField(max_length=100)

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    project_no = models.CharField(max_length=50)

    currency = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=50)

    payee_to = models.CharField(max_length=100)
    supplier_name = models.CharField(max_length=100)

    withheld_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    invoice_note = models.CharField(max_length=100)

    status = models.CharField(max_length=50, default="Pending")

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)