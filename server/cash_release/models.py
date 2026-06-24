from django.db import models

# Create your models here.
class CashRelease(models.Model):
    request = models.OneToOneField('requests.Request', on_delete=models.CASCADE)

    released_by = models.ForeignKey('users.User', on_delete=models.CASCADE)
    released_date = models.DateTimeField(auto_now_add=True)

    remarks = models.TextField(blank=True)