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

    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)


    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def __str__(self):
        return f"{self.user.username} - {self.role}"