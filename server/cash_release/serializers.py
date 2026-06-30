from rest_framework import serializers
from .models import CashRelease

class CashReleaseSerializer(serializers.ModelSerializer):
    released_by_name = serializers.CharField(source='released_by.username', read_only=True)

    class Meta:
        model = CashRelease
        fields = [
            'id',
            'request',
            'amount',
            'released_by',
            'released_by_name',
            'released_date',
            'status',
            'remarks',
        ]
        read_only_fields = ['released_by', 'released_date']
