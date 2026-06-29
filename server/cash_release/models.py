from django.db import models
from django.conf import settings 

# Create your models here.
class CashRelease(models.Model):
    request = models.OneToOneField('request.Request', on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    released_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    released_date = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('released', 'Released'),
            ('completed', 'Completed'),
            ('flagged', 'Flagged'),
        ],
        default='pending'
    )

    remarks = models.TextField(blank=True)