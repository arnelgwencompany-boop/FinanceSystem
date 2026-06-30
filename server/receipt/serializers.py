from rest_framework import serializers
from .models import Receipt
class ReceiptUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = [
            'id',
            'cash_release',  
            'file',
            'amount',
            'uploaded_at',
        ]
        read_only_fields = ['uploaded_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate_cash_release(self, value):
        if value.status != 'released':
            raise serializers.ValidationError("Cash is not released yet.")
        return value
    
class ReceiptSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True)

    class Meta:
        model = Receipt
        fields = [
            'id',
            'cash_release',   
            'uploaded_by',
            'uploaded_by_name',
            'file',
            'amount',
            'status',
            'reviewed_by',
            'reviewed_by_name',
            'review_notes',
            'uploaded_at',
            'reviewed_at',
        ]
        read_only_fields = [
            'uploaded_by',
            'status',
            'reviewed_by',
            'reviewed_at',
        ]