from django.urls import path
from .views import ReceiptListCreateView, ReceiptDetailView

urlpatterns = [
    # List + Create
    path('receipts/', ReceiptListCreateView.as_view(), name='receipt-list-create'),
    # Detail + Update + Delete
    path('receipts/<int:pk>/', ReceiptDetailView.as_view(), name='receipt-detail'),
]