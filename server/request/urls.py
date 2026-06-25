from django.urls import path
from .views import RequestCreateView

urlpatterns = [
    # add routes here
    path('create-request/', RequestCreateView.as_view(), name='request-create'),
]