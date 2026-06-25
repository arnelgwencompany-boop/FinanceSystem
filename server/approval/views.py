from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from .models import Approval
from .serializers import ApprovalSerializer


class BaseApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Approval.objects.get(pk=pk)
        except Approval.DoesNotExist:
            raise PermissionDenied("Approval not found.")

    def check_permission(self, approval, user):
        if approval.role != user.role:
            raise PermissionDenied("You cannot approve this step.")

    def process_approval(self, approval, user, status, comment=""):
        if approval.signed_by:
            raise PermissionDenied("Already processed.")

        # Optional: enforce order
        previous = Approval.objects.filter(
            request=approval.request,
            order__lt=approval.order
        ).exclude(status="approved")

        if previous.exists():
            raise PermissionDenied("Previous approvals must be completed first.")

        approval.status = status
        approval.comment = comment

        if status in ["approved", "rejected"]:
            approval.signed_by = user
            approval.signed_at = timezone.now()

        approval.save()
        return approval
    