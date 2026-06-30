from rest_framework import serializers
from .models import Approval
from django.utils import timezone

class ApprovalSerializer(serializers.ModelSerializer):
    signed_by_name = serializers.CharField(
        source="signed_by.get_full_name", read_only=True
    )

    class Meta:
        model = Approval
        fields = [
            "id",
            "request",
            "role",
            "status",
            "signed_by",
            "signed_by_name",
            "signed_at",
            "comment",
            "order",
        ]
        read_only_fields = ["signed_by", "signed_at"]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Only update approval-related fields
        instance.status = validated_data.get("status", instance.status)
        instance.comment = validated_data.get("comment", "")

        # When approved/rejected → set signer + timestamp
        if instance.status in ["approved", "rejected"]:
            instance.signed_by = request.user
            instance.signed_at = timezone.now()

        instance.save()
        return instance