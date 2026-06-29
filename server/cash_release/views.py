from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CashRelease
from .serializers import CashReleaseSerializer

class CashReleaseListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            cash_releases = CashRelease.objects.all().order_by('-released_date')
        else:
            cash_releases = CashRelease.objects.filter(
                request__user=request.user
            ).order_by('-released_date')

        serializer = CashReleaseSerializer(cash_releases, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CashReleaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(released_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CashReleaseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return CashRelease.objects.get(pk=pk)

    def get(self, request, pk):
        cash = self.get_object(pk)
        serializer = CashReleaseSerializer(cash)
        return Response(serializer.data)

    def put(self, request, pk):
        cash = self.get_object(pk)
        serializer = CashReleaseSerializer(cash, data=request.data)

        if serializer.is_valid():
            # Only finance can change status
            if not request.user.is_staff:
                serializer.save(status=cash.status)
            else:
                serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cash = self.get_object(pk)
        cash.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)