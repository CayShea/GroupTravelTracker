from django.shortcuts import render
from .models import Traveldocs
from .serializers import TraveldocsSerializer, TraveldocsWriteSerializer
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


class TraveldocsViewSet(RWSerializerModelViewSet):
    model = Traveldocs
    parser_classes = (MultiPartParser, FormParser)
    serializer_class_read = TraveldocsSerializer
    serializer_class_write = TraveldocsWriteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        private_user_docs = Traveldocs.objects.filter(owner_id=self.request.user.id, trip__isnull=True, event__isnull=True, isprivate=True)
        if self.request.GET.get('trip_id'):
            private_trip_docs = Traveldocs.objects.filter(owner_id=self.request.user.id, trip__id=self.request.GET.get('trip_id'), isprivate=True)
            public_trip_docs = Traveldocs.objects.filter(trip__id=self.request.GET.get('trip_id'), isprivate=False)
            # return {
            #     "private_user_docs": private_user_docs,
            #     "private_trip_docs": private_trip_docs,
            #     "public_trip_docs": public_trip_docs
            # }
            private_user_docs = private_user_docs | private_trip_docs | public_trip_docs
        return private_user_docs
    
    def post(self, request, *args, **kwargs):
        posts_serializer = TraveldocsWriteSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        request_body=TraveldocsWriteSerializer(), responses={status.HTTP_201_CREATED: TraveldocsSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *arg, **kwargs) -> Response:
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance: "Traveldocs"):
        instance.delete()
