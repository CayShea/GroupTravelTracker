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
        return Note.objects.all()
    
    def post(self, request, *args, **kwargs):
        posts_serializer = NotesWriteSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
