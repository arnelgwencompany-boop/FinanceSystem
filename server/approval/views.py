from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.utils import timezone
from .models import Approval
from .serializers import ApprovalSerializer
from .services import ApprovalService


class BaseApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Approval.objects.get(pk=pk)
        except Approval.DoesNotExist:
            raise PermissionDenied("Approval not found.")

    def check_permission(self, approval, user):
        if approval.role != user.userprofile.role:
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
    
class ApproveView(BaseApprovalView):
    def put(self, request, pk):
        approval = self.get_object(pk)

        self.check_permission(approval, request.user)

        updated = self.process_approval(
            approval,
            request.user,
            status="approved",
            comment=request.data.get("comment", "")
        )
        # ApprovalService.finalize_request_if_fully_approved(
        #     updated.request,
        #     request.user
        # )

        return Response(ApprovalSerializer(updated).data)
    
class RejectView(BaseApprovalView):
    def put(self, request, pk):
        approval = self.get_object(pk)

        self.check_permission(approval, request.user)

        updated = self.process_approval(
            approval,
            request.user,
            status="rejected",
            comment=request.data.get("comment", "")
        )

        return Response(ApprovalSerializer(updated).data)
    
    