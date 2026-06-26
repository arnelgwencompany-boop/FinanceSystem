from django.urls import path
from .views import ApproveView, RejectView

urlpatterns = [
    path('approvals/<int:pk>/approve/', ApproveView.as_view(), name='approve'),
    path('approvals/<int:pk>/reject/', RejectView.as_view(), name='reject'),
]