from django.shortcuts import render
from rest_framework import viewsets, mixins, status
from drf_yasg.utils import swagger_auto_schema
from ..trips.extensions.views import RWSerializerModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
import logging

from .models import TripMember
from .serializers import TripMemberSerializer, TripMemberWriteSerializer
from ..trips.models import Trip

LOG = logging.getLogger(__name__)


class TripMemberViewSet(RWSerializerModelViewSet):
    model = TripMember
    serializer_class_read = TripMemberSerializer
    serializer_class_write = TripMemberWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripMember.objects.all()

    @swagger_auto_schema(
        request_body=TripMemberWriteSerializer(), responses={status.HTTP_201_CREATED: TripMemberSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=TripMemberWriteSerializer(), responses={status.HTTP_201_CREATED: TripMemberSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Trip"):
        instance.delete()
