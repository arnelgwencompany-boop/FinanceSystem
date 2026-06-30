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

    def check_permission(self, request, receipt):
        # Owner OR finance/admin
        return receipt.uploaded_by == request.user or request.user.is_staff

    def get(self, request, pk):
        receipt = self.get_object(pk)
        if not self.check_permission(request, receipt):
            return Response({'error': 'Not allowed'}, status=403)
        serializer = ReceiptSerializer(receipt)
        return Response(serializer.data)

    def put(self, request, pk):
        receipt = self.get_object(pk)
        # Only owner can update AND only if still pending
        if receipt.uploaded_by != request.user:
            return Response({'error': 'Only owner can update'}, status=403)
        if receipt.status != 'pending':
            return Response({'error': 'Cannot update after review'}, status=400)
        serializer = ReceiptUploadSerializer(receipt, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        receipt = self.get_object(pk)
        # Only owner or admin can delete
        if not self.check_permission(request, receipt):
            return Response({'error': 'Not allowed'}, status=403)
        # Optional rule: prevent deleting approved receipts
        if receipt.status == 'approved':
            return Response({'error': 'Cannot delete approved receipt'}, status=400)
        receipt.delete()
        return Response({'message': 'Deleted successfully'}, status=204)