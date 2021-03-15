from django.shortcuts import render
from .models import Checklist
from .serializers import ChecklistsSerializer, ChecklistsWriteSerializer
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from ..trips.extensions.views import RWSerializerModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
import logging

LOG = logging.getLogger(__name__)


class ChecklistViewSet(RWSerializerModelViewSet):
    model = Checklist
    serializer_class_read = ChecklistsSerializer
    serializer_class_write = ChecklistsWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.GET.get('trip_id') and self.request.GET.get('event_id'):
            return (Checklist.objects.filter(trip__id=self.request.GET.get('trip_id'), event__id=self.request.GET.get('event_id')).order_by('date'))
        elif self.request.GET.get('trip_id'):
            return (Checklist.objects.filter(trip__id=self.request.GET.get('trip_id'), event__isnull=True).order_by('date'))
        else:
            return (Checklist.objects.filter(author_id=self.request.user.id).order_by('date'))

    @swagger_auto_schema(
        request_body=ChecklistsWriteSerializer(), responses={status.HTTP_201_CREATED: ChecklistsSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=ChecklistsWriteSerializer(), responses={status.HTTP_201_CREATED: ChecklistsSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Checklists"):
        instance.delete()
