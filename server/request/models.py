from django.db import models
from django.conf import settings 

# Create your models here.
class Request(models.Model):
    STATUS_CHOICES = [
    ("draft", "Draft"),
    ("pending_supervisor", "Pending Supervisor"),
    ("pending_director", "Pending Director"),
    ("pending_finance", "Pending Finance"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),
]


    request_no = models.CharField(max_length=50, unique=True)

    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    ext = models.CharField(max_length=10, blank=True, null=True)

    project_no = models.CharField(max_length=50, blank=True, null=True)

    date = models.DateField()
    due_date = models.DateField(null=True, blank=True)

    description = models.TextField()

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('PHP', 'PHP'),
        ('OTHER', 'Other'),
    ]
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='PHP')

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    vat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    without_vat = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    PAYMENT_METHOD_CHOICES = [
        ('TT', 'T/T'),
        ('CASH', 'Cash'),
    ]
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='TT')

    PAYEE_TYPE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('SUPPLIER', 'Supplier'),
    ]
    payee_type = models.CharField(max_length=20, choices=PAYEE_TYPE_CHOICES, default='EMPLOYEE')
    payee_name = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=50, default="Pending")

    # Approval workflow
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="draft")

    # Attachments / notes
    invoice = models.FileField(upload_to='invoices/', null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.request_no:
            last_id = Request.objects.count() + 1
            self.request_no = f"REQ-{last_id:05d}"
        super().save(*args, **kwargs)