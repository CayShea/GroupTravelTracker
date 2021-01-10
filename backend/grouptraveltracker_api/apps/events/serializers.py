import logging
import uuid
import shortuuid
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from ..trip_members.models import TripMember
from ..trips.models import Trip
from ..trips.serializers import InlineTripSerializer
from ..users.models import CustomUser
from .models import Event

LOG = logging.getLogger(__name__)


class EventWriteSerializer(serializers.ModelSerializer):
    trip_id = serializers.CharField(max_length=255, default=shortuuid.uuid)
    attending = serializers.ListField(
        child=serializers.CharField(required=False, allow_null=False),
        required=False,
        allow_empty=True,
    )
    start = serializers.DateTimeField(required=True)
    end = serializers.DateTimeField(required=True)
    title = serializers.CharField(max_length=64)

    class Meta:
        model = Event
        exclude = ('trip',)

    def validate(self, attrs):
        trip_id = attrs["trip_id"]
        attending = attrs.get("attending", [])

        try:
            attrs["trip"] = trip = Trip.objects.get(id=trip_id)
        except:
            raise serializers.ValidationError("Trip Id does not exist")
        for user in attending:
            try:
                TripMember.objects.get(trip=trip, user__display_name=user)
            except:
                raise serializers.ValidationError("All Attending members must be current Trip Members of this Trip.")
        return attrs
    
    def create(self, validated_data):
        with transaction.atomic():
            event = Event.objects.create(**validated_data)
            return event

    def update(self, instance, validated_data):
        with transaction.atomic():
            event_data = dict(validated_data)
            event = super().update(instance, event_data)
            return event


class EventSerializer(serializers.ModelSerializer):
    trip = serializers.CharField(source="trip.name", read_only=True)
    attending = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )
    calendarId = serializers.SerializerMethodField('_going')
    current_user = serializers.SerializerMethodField('_user')    
    
    def _user(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.user.display_name
    
    def _going(self, obj):
        request = self.context.get('request', None)
        if request:
            current_user = request.user.display_name
            if current_user in obj.attending:
                return "Going"
            else:
                return "notGoing"

    class Meta:
        model = Event
        fields = ("id", "title", "body", "start", "end", "trip", "attending", "calendarId", "current_user")