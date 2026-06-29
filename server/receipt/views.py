from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Receipt
from .serializers import ReceiptUploadSerializer
from .serializers import ReceiptSerializer
# Create your views here.
class ReceiptListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Employee sees only their receipts
        receipts = Receipt.objects.filter(
            uploaded_by=request.user
        ).order_by('-uploaded_at')

        serializer = ReceiptUploadSerializer(receipts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReceiptUploadSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReceiptDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return Receipt.objects.get(pk=pk)

    def get(self, request, pk):
        receipt = self.get_object(pk)

        # Restrict access
        if receipt.uploaded_by != request.user and not request.user.is_staff:
            return Response({'error': 'Not allowed'}, status=403)

        serializer = ReceiptSerializer(receipt)
        return Response(serializer.data)