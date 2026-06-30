from cash_release.models import CashRelease

class ApprovalService:
    def finalize_request_if_fully_approved(request_obj):
        approvals = request_obj.approvals.all()

        # Check if all approvals are approved
        if all(a.status == "approved" for a in approvals):
            request_obj.status = "approved"
            request_obj.save()

            # Prevent duplicates
            if not hasattr(request_obj, "cashrelease"):
                CashRelease.objects.create(
                    request=request_obj,
                    amount=request_obj.amount,
                    status="pending"
                )