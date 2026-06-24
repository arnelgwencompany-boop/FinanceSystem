from django.db import models
from django.conf import settings 

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    role = models.CharField(max_length=20, choices=[
        ('employee', 'Employee'),
        ('supervisor', 'Supervisor'),
        ('director', 'Director'),
        ('finance', 'Finance'),
        ('admin', 'Admin'),
    ])