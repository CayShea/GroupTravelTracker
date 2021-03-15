from django.shortcuts import render
from .models import Note
from .serializers import NotesSerializer, NotesWriteSerializer
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from ..trips.extensions.views import RWSerializerModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
import logging

LOG = logging.getLogger(__name__)


class NotesViewSet(RWSerializerModelViewSet):
    model = Note
    serializer_class_read = NotesSerializer
    serializer_class_write = NotesWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # for now, just making all notes PUBLIC...
        if self.request.GET.get('trip_id') and self.request.GET.get('event_id'):
            return (Note.objects.filter(trip__id=self.request.GET.get('trip_id'), event__id=self.request.GET.get('event_id')).order_by('date'))
        elif self.request.GET.get('trip_id'):
            return (Note.objects.filter(trip__id=self.request.GET.get('trip_id'), event__isnull=True).order_by('date'))
        else:
            return (Note.objects.filter(author_id=self.request.user.id).order_by('date'))

    @swagger_auto_schema(
        request_body=NotesWriteSerializer(), responses={status.HTTP_201_CREATED: NotesSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=NotesWriteSerializer(), responses={status.HTTP_201_CREATED: NotesSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Notes"):
        instance.delete()
