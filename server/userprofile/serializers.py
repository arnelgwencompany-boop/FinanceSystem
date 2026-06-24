from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


#  User Serializer
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']
        extra_kwargs = {
            'username': {'validators': []},  
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def validate_username(self, value):
        user = self.instance

        # Allow same username for current user
        if User.objects.exclude(id=user.id if user else None).filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")

        return value


#  User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = UserProfile
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        #  Nested user update
        if user_data:
            user_serializer = UserSerializer(
                instance.user,
                data=user_data,
                partial=True  #  important for partial updates
            )
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        #  Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance