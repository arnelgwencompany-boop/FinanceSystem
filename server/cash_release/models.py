from django.db import models
from django.conf import settings 

# Create your models here.
class CashRelease(models.Model):
    request = models.OneToOneField('request.Request', on_delete=models.CASCADE)

    released_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    released_date = models.DateTimeField(auto_now_add=True)

    remarks = models.TextField(blank=True)