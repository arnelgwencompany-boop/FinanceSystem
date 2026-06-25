from rest_framework import serializers
from .models import Request


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
        return super().create(validated_data)
    