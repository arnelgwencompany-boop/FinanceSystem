from django.urls import path
from .views import (
    RequestCreateView,
    RequestListView,
    RequestDetailView
)

urlpatterns = [
    # add routes here
    path('create-requests/', RequestCreateView.as_view(), name='request-create'),
    path('requests/', RequestListView.as_view(), name='request-list'),
    path('requests/<int:pk>/', RequestDetailView.as_view(), name='request-detail'),
]