from django.shortcuts import render
from rest_framework import viewsets, mixins, status
from drf_yasg.utils import swagger_auto_schema
from ..trips.extensions.views import RWSerializerModelViewSet
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
import logging

from .models import CustomUser
from .serializers import UserSerializer
from rest_auth.registration.views import RegisterView
from ..trips.models import Trip

LOG = logging.getLogger(__name__)


class CustomUserViewSet(RWSerializerModelViewSet):
    model = CustomUser
    serializer_class_read = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    get_queryset = CustomUser.objects.all()

    def get_queryset(self):
        return CustomUser.objects.all()

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "User"):
        instance.delete()


class CustomRegisterView(RegisterView):
    queryset = CustomUser.objects.all()