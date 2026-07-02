from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from notifications.models import Notification

from .models import Request
from .serializers import (
    RequestSerializer, 
    RequestCreateSerializer, 
    RequesteEmployeeSerializer,
    RequestWithApprovedSerializer,
    RequestFinanceSerializer
)
# Create your views here.
# EMPLOYEE VIEWS ==============================================
class RequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RequestCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            request_obj = serializer.save()

            employee = request.user
            employee_profile = employee.userprofile  # adjust if different related_name
            department = employee_profile.department

            #  find supervisor in same department
            supervisor = User.objects.filter(
                userprofile__department=department,
                userprofile__role="supervisor"
            ).first()

            # create notification if supervisor exists
            if supervisor:
                Notification.objects.create(
                    recipient=supervisor,
                    sender=employee,
                    request=request_obj,
                    notification_type="request_created",
                    title="New Request",
                    message="A new request needs your approval"
                )

            return Response(
                RequestSerializer(request_obj).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# for employee request list
class RequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Request.objects.all().order_by("-created_at")
        serializer = RequesteEmployeeSerializer(queryset, many=True)
        return Response(serializer.data) 

class RequestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            req = Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        serializer = RequestSerializer(req)
        return Response(serializer.data)
    
    def put(self, request, pk):
        try:
            req = Request.objects.get(pk=pk)
            if req.status == "pending" or req.status == "draft":
                serializer = RequestSerializer(req, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Cannot update a request that is not pending."}, status=status.HTTP_400_BAD_REQUEST)
        except Request.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        
    def delete(self, request, pk):
        try:
            req = Request.objects.get(pk=pk)
            if req.status == "pending" or req.status == "draft":
                req.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "Cannot delete a request that is not pending."}, status=status.HTTP_400_BAD_REQUEST)
        except Request.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        
# SUPERVISOR AND DIRECTOR VIEWS ============================================
class RequestSupUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_department = request.user.userprofile.department

        queryset = Request.objects.filter(
            department=user_department
        ).order_by("-created_at")

        serializer =  RequestWithApprovedSerializer(queryset, many=True)
        return Response(serializer.data)
    
# FINANCE VIEWS ============================================
class RequestFinanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Request.objects.filter(
            approvals__role="supervisor",
            approvals__status="approved"
        ).filter(
            approvals__role="director",
            approvals__status="approved"
        ).distinct().order_by("-created_at")

        serializer = RequestFinanceSerializer(queryset, many=True)
        return Response(serializer.data)
