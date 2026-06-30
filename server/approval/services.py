from cash_release.models import CashRelease
class ApprovalService:

    @staticmethod
    def finalize_request_if_fully_approved(request_obj, user=None):
        print("Create Cash Release is Running")
        required_roles = {"supervisor", "director", "finance"}

        approvals = request_obj.approvals.filter(role__in=required_roles)

        approved_roles = set(
            approvals.filter(status="approved").values_list("role", flat=True)
        )


        if required_roles.issubset(approved_roles):

            request_obj.status = "approved"
            request_obj.save()

            if not hasattr(request_obj, "cash_release"):
                CashRelease.objects.create(
                    request=request_obj,
                    amount=request_obj.amount,
                    status="pending",
                    released_by=user   
                )