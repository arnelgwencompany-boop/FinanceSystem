from rest_framework import serializers
from .models import Request
from approval.models import Approval
from django.db import transaction
from approval.serializers import ApprovalSerializer
from cash_release.serializers import CashReleaseSerializer
from receipt.serializers import ReceiptSerializer

class RequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.SerializerMethodField()
    class Meta:
        model = Request
        fields = "__all__"
        read_only_fields = ["request_no", "requested_by", "status", "created_at"]
    
    def get_requested_by_name(self, obj):
        return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"


class RequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        exclude = ["request_no", "status", "created_at"]
        read_only_fields = ["requested_by"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_by"] = user

        with transaction.atomic():
            req = super().create(validated_data)

            approvals = [
                Approval(
                    request=req,
                    role="supervisor",
                    order=1,
                    status="pending",
                    signed_by=None,
                    signed_at=None,
                    comment=""
                ),
                Approval(
                    request=req,
                    role="director",
                    order=2,
                    status="pending",
                    signed_by=None,
                    signed_at=None,
                    comment=""
                ),
                Approval(
                    request=req,
                    role="finance",
                    order=3,
                    status="pending",
                    signed_by=None,
                    signed_at=None,
                    comment=""
                ),
                Approval(
                    request=req,
                    role="admin",
                    order=4,
                    status="pending",
                    signed_by=None,
                    signed_at=None,
                    comment=""
                ),
            ]

            Approval.objects.bulk_create(approvals)

        return req

#   APPROVED SERIALIZER
class RequestWithApprovedSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(
        source="requested_by.get_full_name", read_only=True
    )

    approvals = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            "id",
            "request_no",
            "requested_by",
            "requested_by_name",
            "employee_id",
            "department",
            "ext",
            "project_no",
            "date",
            "due_date",
            "description",
            "currency",
            "amount",
            "vat",
            "without_vat",
            "delivery_fee",
            "payment_method",
            "payee_type",
            "payee_name",
            "status",
            "invoice",
            "note",
            "created_at",
            "approvals",
        ]

    def get_approvals(self, obj):
        approvals = obj.approvals.all().order_by("order")
        return ApprovalSerializer(approvals, many=True).data
    
# FINANCE SERIALIZER
class RequestFinanceSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(
        source="requested_by.get_full_name", read_only=True
    )

    approvals = serializers.SerializerMethodField()
    cash_release = serializers.SerializerMethodField() 
    receipts = serializers.SerializerMethodField()
    class Meta:
        model = Request
        fields = [
            "id",
            "request_no",
            "requested_by_name",
            "department",
            "project_no",
            "date",
            "due_date",
            "description",
            "currency",
            "amount",
            "payment_method",
            "payee_type",
            "payee_name",
            "status",
            "approvals",
            "cash_release",
            "receipts",
        ]
    
    def get_approvals(self, obj):
        approvals = obj.approvals.all().order_by("order")
        return ApprovalSerializer(approvals, many=True).data

    def get_cash_release(self, obj):
        finance_approval = obj.approvals.filter(role="finance").first()

        if finance_approval and finance_approval.status == "approved":
            cash_release = getattr(obj, "cashrelease", None)

            if cash_release:
                return CashReleaseSerializer(cash_release).data

        return None
    
    def get_receipts(self, obj):
        finance_approval = obj.approvals.filter(role="finance").first()

        if finance_approval and finance_approval.status == "approved":
            cash_release = getattr(obj, "cashrelease", None)

            if cash_release:
                receipts = cash_release.receipts.all().order_by('-uploaded_at')
                return ReceiptSerializer(receipts, many=True).data

        return []