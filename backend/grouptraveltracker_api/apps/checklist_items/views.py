from django.shortcuts import render
from .models import ChecklistItem
from .serializers import ChecklistItemsSerializer, ChecklistItemsWriteSerializer
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


class ChecklistItemViewSet(RWSerializerModelViewSet):
    model = ChecklistItem
    serializer_class_read = ChecklistItemsSerializer
    serializer_class_write = ChecklistItemsWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.GET.get('checklist_id'):
            return (ChecklistItem.objects.filter(checklist__id=self.request.GET.get('checklist_id')))
        else:
            return ChecklistItem.objects.all()

    @swagger_auto_schema(
        request_body=ChecklistItemsWriteSerializer(), responses={status.HTTP_201_CREATED: ChecklistItemsSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=ChecklistItemsWriteSerializer(), responses={status.HTTP_201_CREATED: ChecklistItemsSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "ChecklistItems"):
        instance.delete()
