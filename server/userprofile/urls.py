from django.urls import path
from .views import (
    MyProfileView,
    EditProfileView,
)

urlpatterns = [
    path('my-profile/', MyProfileView.as_view(), name='my-profile'),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
]