from django.urls import path
from .views import CashReleaseListCreateView, CashReleaseDetailView

urlpatterns = [
    # List all cash releases / Create new cash release
    path('cash-releases/', CashReleaseListCreateView.as_view(), name='cash-release-list-create'),
    # Retrieve, Update, Delete a specific cash release
    path('cash-releases/<int:pk>/', CashReleaseDetailView.as_view(), name='cash-release-detail'),
]