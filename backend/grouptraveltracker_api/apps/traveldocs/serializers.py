from rest_framework import serializers
from django.db import transaction
import shortuuid
import logging
import requests
from .models import Traveldocs
from ..users.models import CustomUser
from ..trips.models import Trip
from ..events.models import Event


LOG = logging.getLogger(__name__)

class TraveldocsWriteSerializer(serializers.ModelSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
        source="owner",
    )
    trip_id = serializers.CharField(max_length=255, required=False)
    event_id = serializers.CharField(max_length=255, required=False)
    isprivate = serializers.BooleanField(default=False)
    name = serializers.CharField(allow_blank=True, required=False)
    note = serializers.CharField(allow_blank=True, required=False)
    filepath = serializers.FileField()

    class Meta:
        model = Traveldocs
        exclude = ('trip', 'event')

    def validate(self, attrs):
        trip_id = attrs["trip_id"]
        event_id = attrs.get("event_id", "")

        if trip_id:
            try:
                attrs["trip"] = trip = Trip.objects.get(id=trip_id)
            except:
                raise serializers.ValidationError("Trip Id does not exist")
        if event_id:
            try:
                attrs["event"] = event = Event.objects.get(id=event_id)
            except:
                raise serializers.ValidationError("Event Id does not exist")
        return attrs
    
    def create(self, validated_data):
        with transaction.atomic():
            validated_data["owner_id"] = self.context['request'].user

            traveldoc = Traveldocs.objects.create(**validated_data)
            return traveldoc


class TraveldocsSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="owner.display_name", read_only=True)

    class Meta:
        model = Traveldocs
        fields = '__all__'


class InlineDocsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveldocs
        fields = ("id", "name", "event", "note", "filepath", "isprivate",)