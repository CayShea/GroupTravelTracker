import logging
import uuid
import shortuuid
import requests
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from ..trip_members.models import TripMember
from ..trips.models import Trip
from ..trips.serializers import InlineTripSerializer
from ..users.models import CustomUser
from ..location.serializers import InlineLocationSerializer
from ..location.models import Location
from .models import Event

LOG = logging.getLogger(__name__)


class EventWriteSerializer(serializers.ModelSerializer):
    trip_id = serializers.CharField(max_length=255, default=shortuuid.uuid)
    attendees = serializers.ListField(
        child=serializers.CharField(required=False, allow_null=False),
        required=False,
        allow_empty=True,
    )
    start = serializers.DateTimeField(required=True)
    end = serializers.DateTimeField(required=True)
    title = serializers.CharField(max_length=64)
    location_string = serializers.CharField(max_length=60, required=False, allow_null=True)
    isPrivate = serializers.BooleanField(default=False)

    class Meta:
        model = Event
        exclude = ('trip',)

    def validate(self, attrs):
        trip_id = attrs["trip_id"]
        attendees = attrs.get("attendees", [])

        try:
            attrs["trip"] = trip = Trip.objects.get(id=trip_id)
        except:
            raise serializers.ValidationError("Trip Id does not exist")
        for user in attendees:
            try:
                TripMember.objects.get(trip=trip, user__display_name=user)
            except:
                raise serializers.ValidationError("All attendees must be current Trip Members of this Trip.")
        return attrs
    
    def create(self, validated_data):
        with transaction.atomic():
            location_title = validated_data.get("location_string")
            current_user = self.context.get('request').user.display_name
            validated_data['attendees'] = [current_user]
            
            if location_title:
                validated_data.pop('location_string')
                ## *****
                #       TECH DEBT - need to move the api_key to .env
                REACT_APP_geocode = 'AIzaSyAB4IhbKO9yAESB1YKKjg99lVm7cf7DjUk'
                r = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?address={location_title}&key={REACT_APP_geocode}')
                lat = r.json().get('results')[0].get('geometry').get('location').get('lat')
                lng = r.json().get('results')[0].get('geometry').get('location').get('lng')

                location = Location.objects.create(title=location_title, lat=lat, lng=lng)
                validated_data["location"] = location

            event = Event.objects.create(**validated_data)
            return event

    def update(self, instance, validated_data):
        with transaction.atomic():
            event_data = dict(validated_data)
            event = super().update(instance, event_data)
            return event


class EventSerializer(serializers.ModelSerializer):
    trip = serializers.CharField(source="trip.name", read_only=True)
    attendees = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )
    calendarId = serializers.SerializerMethodField('_going')
    current_user = serializers.SerializerMethodField('_user')
    location = InlineLocationSerializer(required=False, many=False, read_only=True)
    
    def _user(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.user.display_name
    
    def _going(self, obj):
        request = self.context.get('request', None)
        if request:
            current_user = request.user.display_name
            if obj.attendees and current_user in obj.attendees:
                return "going"
            else:
                return "notGoing"

    class Meta:
        model = Event
        fields = ("id", "title", "body", "start", "end", "location", "trip", "attendees", "calendarId", "location", "isPrivate", "current_user")
