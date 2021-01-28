from django.shortcuts import render
from rest_framework import viewsets, mixins, status
from drf_yasg.utils import swagger_auto_schema
from ..trips.extensions.views import RWSerializerModelViewSet, GetObjectDistinctMixin
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
import logging

from .models import Event
from .serializers import EventSerializer, EventWriteSerializer

LOG = logging.getLogger(__name__)


class EventViewSet(GetObjectDistinctMixin, RWSerializerModelViewSet):
    model = Event
    serializer_class_read = EventSerializer
    serializer_class_write = EventWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.GET.get('trip_id'):
            return (Event.objects.filter(trip__owner__id=self.request.user.id, trip__id=self.request.GET.get('trip_id')).order_by('start'))
        else:
            return (Event.objects.filter(trip__owner_id=self.request.user.id).order_by('start'))

    @swagger_auto_schema(
        request_body=EventWriteSerializer(), responses={status.HTTP_201_CREATED: EventSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=EventWriteSerializer(), responses={status.HTTP_200_OK: EventSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(request_body=EventWriteSerializer(), responses={status.HTTP_200_OK: EventSerializer()})
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Event"):
        instance.delete()
