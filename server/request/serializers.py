from rest_framework import serializers
from .models import Request


class RequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(
        source="requested_by.username", read_only=True
    )
    class Meta:
        model = Request
        fields = "__all__"
        read_only_fields = ["request_no", "requested_by", "status", "created_at"]


class RequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        exclude = ["request_no", "status", "created_at"]
        read_only_fields = ["requested_by"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_by"] = user
        return super().create(validated_data)