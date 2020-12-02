from django.shortcuts import render
from rest_framework import viewsets, mixins, status
from drf_yasg.utils import swagger_auto_schema
from .extensions.views import RWSerializerModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
import logging

from .models import Trip
from .serializers import TripSerializer, TripWriteSerializer
# from .bulk import BulkTripDeleteSerializer

LOG = logging.getLogger(__name__)


class TripViewSet(RWSerializerModelViewSet):
    model = Trip
    serializer_class_read = TripSerializer
    serializer_class_write = TripWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(owner_id=self.request.user.id)

    @swagger_auto_schema(
        request_body=TripWriteSerializer(), responses={status.HTTP_201_CREATED: TripSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=TripWriteSerializer(), responses={status.HTTP_201_CREATED: TripSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Trip"):
        instance.delete()

# class TripBulkViewSet(_BulkViewSet):
#     bulk_delete_serializer_class = BulkTripDeleteSerializer
