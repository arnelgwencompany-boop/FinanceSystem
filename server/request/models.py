from django.db import models

# Create your models here.
class Request(models.Model):
    request_no = models.CharField(max_length=50, unique=True)

    requested_by = models.ForeignKey('users.User', on_delete=models.CASCADE)
    department = models.CharField(max_length=100)

    date = models.DateField()
    description = models.TextField()

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    vat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    without_vat = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    status = models.CharField(max_length=50, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)