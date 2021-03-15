from rest_framework import serializers
from django.db import transaction
import shortuuid
import logging
import requests
from .models import Note
from ..users.models import CustomUser
from ..trips.models import Trip
from ..events.models import Event

LOG = logging.getLogger(__name__)


class NotesWriteSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
        source="author",
    )
    trip_id = serializers.CharField(max_length=255, required=False)
    event_id = serializers.CharField(max_length=255, required=False)
    isprivate = serializers.BooleanField(default=False)
    title = serializers.CharField(allow_blank=True, required=False)
    body = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Note
        exclude = ('trip', 'event')

    def validate(self, attrs):
        trip_id = attrs.get("trip_id", "")
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
        validated_data["author_id"] = self.context['request'].user

        note = Note.objects.create(**validated_data)
        return note


class NotesSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.display_name", read_only=True)
    author_photo = serializers.ImageField(source="author.photo", read_only=True, required=False)

    class Meta:
        model = Note
        fields = ('author_name', 'author_photo', 'body', 'id')


class InlineNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("id", "title", "event", "body", "isprivate",)