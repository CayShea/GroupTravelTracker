import os
from rest_framework import serializers
import requests
from .models import Location
import logging

LOG = logging.getLogger(__name__)


class InlineLocationSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False, allow_null=True)
    lat = serializers.DecimalField(max_digits = 7, decimal_places = 5, required=False, allow_null=True)
    lng = serializers.DecimalField(max_digits = 7, decimal_places = 5, required=False, allow_null=True)

    class Meta:
        model = Location
        fields = ("title", "lat", "lng")