from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.utils import timezone
from .models import Approval
from .serializers import ApprovalSerializer
from django.contrib.auth.models import User
from notifications.models import Notification

# process approval and rejection in a base class to avoid code duplication
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
        # Enforce order
        previous = Approval.objects.filter(
            request=approval.request,
            order__lt=approval.order
        ).exclude(status="approved")
        if previous.exists():
            raise PermissionDenied("Previous approvals must be completed first.")
        # Update approval
        approval.status = status
        approval.comment = comment
        if status in ["approved", "rejected"]:
            approval.signed_by = user
            approval.signed_at = timezone.now()

        approval.save()
        # UPDATE REQUEST STATUS HERE
        request = approval.request

        if status == "rejected":
            request.status = "rejected"
        elif status == "approved":
            role = approval.role
            if role == "supervisor":
                request.status = "supervisor_approved"
            elif role == "director":
                request.status = "director_approved"
            elif role == "finance":
                request.status = "finance_approved"

            #  FINAL CHECK: if all approvals done
            all_approved = not Approval.objects.filter(
                request=request
            ).exclude(status="approved").exists()

            if all_approved:
                request.status = "approved"

        request.save()

        return approval

# views for approving and rejecting requests call the api urls 
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

        req = updated.request
        sender = request.user
        role = sender.userprofile.role
        department = sender.userprofile.department

        # Notify employee (approval info)
        Notification.objects.create(
            recipient=req.employee,
            sender=sender,
            request=req,
            notification_type=f"approved_{role}",
            title=f"{role.capitalize()} Approved",
            message=f"Your request was approved by {role}."
        )

        # Move to next role (NOT cash release yet)
        next_role_map = {
            "supervisor": "director",
            "director": "finance",
            "finance": None,  # STOP here (no cash yet)
        }

        next_role = next_role_map.get(role)

        if next_role:
            next_user = User.objects.filter(
                userprofile__department=department,
                userprofile__role=next_role
            ).first()

            if next_user:
                Notification.objects.create(
                    recipient=next_user,
                    sender=sender,
                    request=req,
                    notification_type=f"approved_{role}",
                    title=f"{role.capitalize()} Approved",
                    message=f"Request needs {next_role} approval"
                )
        else:
            # Finance approved → waiting for cash release
            Notification.objects.create(
                recipient=req.employee,
                sender=sender,
                request=req,
                notification_type="approved_finance",
                title="Finance Approved",
                message="Your request is approved by finance. Waiting for cash release."
            )

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

        req = updated.request
        sender = request.user
        role = sender.userprofile.role

        Notification.objects.create(
            recipient=req.employee,
            sender=sender,
            request=req,
            notification_type="rejected",
            title="Request Rejected",
            message=f"Your request was rejected by {role}. Comment: {updated.comment}"
        )

        return Response(ApprovalSerializer(updated).data)
    
    