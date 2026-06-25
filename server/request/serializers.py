from rest_framework import serializers
from .models import Request
from approval.models import Approval
from django.db import transaction

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
