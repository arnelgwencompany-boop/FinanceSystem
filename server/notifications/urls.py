# notifications/urls.py

from django.urls import path
from .views import UserNotificationListView, MarkNotificationReadView

urlpatterns = [
    path("notifications/", UserNotificationListView.as_view()),
    path("notifications/<int:pk>/mark_read/", MarkNotificationReadView.as_view()),
]