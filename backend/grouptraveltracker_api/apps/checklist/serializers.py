from rest_framework import serializers
from django.db import transaction
import shortuuid
import logging
import requests
from .models import Checklist
from ..checklist_items.serializers import InlineChecklistItemsSerializer
from ..users.models import CustomUser
from ..trips.models import Trip
from ..events.models import Event

LOG = logging.getLogger(__name__)


class ChecklistsWriteSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
        source="author",
    )
    trip_id = serializers.CharField(max_length=255, required=False)
    event_id = serializers.CharField(max_length=255, required=False)
    assigned_to_name = serializers.CharField(max_length=255, required=False)
    isprivate = serializers.BooleanField(default=False)
    title = serializers.CharField(allow_blank=True, required=False)
    body = serializers.CharField(allow_blank=True, required=False)
    is_done = serializers.BooleanField(default=False)

    class Meta:
        model = Checklist
        exclude = ('trip', 'event', 'assigned_to')

    def validate(self, attrs):
        trip_id = attrs.get("trip_id", "")
        event_id = attrs.get("event_id", "")
        assigned_to_name = attrs.get("assigned_to_name", "")

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
        if assigned_to_name:
            try:
                attrs["assigned_to"] = assigned_to = CustomUser.objects.get(display_name=assigned_to_name)
            except:
                raise serializers.ValidationError("Assigned user does not exist")
        else:
            attrs["assigned_to"] = None
        return attrs
    
    def create(self, validated_data):
        validated_data["author_id"] = self.context['request'].user

        checklist = Checklist.objects.create(**validated_data)
        return checklist


class ChecklistsSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.display_name", read_only=True)
    author_photo = serializers.ImageField(source="author.photo", read_only=True, required=False)
    assigned_to_name = serializers.CharField(source="assigned_to.display_name", read_only=True, required=False)
    assigned_to_photo = serializers.ImageField(source="assigned_to.photo", read_only=True, required=False)
    items = InlineChecklistItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Checklist
        fields = ('title', 'author_name', 'author_photo', 'id', 'isprivate', 'assigned_to_name', 'assigned_to_photo', 'is_done', 'items')


class InlineChecklistsSerializer(serializers.ModelSerializer):
    items = InlineChecklistItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Checklist
        fields = ("id", "title", "isprivate", "items")