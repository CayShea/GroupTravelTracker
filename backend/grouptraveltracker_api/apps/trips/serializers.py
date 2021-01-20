from rest_framework import serializers
from .models import Trip, CustomUser
from ..events.models import Event
from ..trip_members.models import TripMember
import logging

LOG = logging.getLogger(__name__)


class InlineTripMemberSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="user.display_name", read_only=True)

    class Meta:
        model = TripMember
        fields = ("display_name",)


class InlineEventSerializer(serializers.ModelSerializer):
    calendarId = serializers.SerializerMethodField('_going')
    category = serializers.CharField(default="time")
    isVisible = serializers.BooleanField(default=True)

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
        fields = ("id", "title", "body", "start", "end", "attendees", "location", "calendarId", "category", "isVisible")


class TripSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="owner.display_name", read_only=True)
    name = serializers.CharField(max_length=64)
    budget = serializers.DecimalField(max_digits=14, decimal_places=2, required=False, allow_null=True)
    startdate = serializers.DateField(required=False, allow_null=True)
    enddate = serializers.DateField(required=False, allow_null=True)
    members = InlineTripMemberSerializer(many=True, read_only=True)
    events = InlineEventSerializer(many=True, read_only=True)
    current_user = serializers.SerializerMethodField('_user')
    
    def _user(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.user.display_name

    class Meta:
        model = Trip
        fields = ("name", "id", "startdate", "enddate", "start_location", "summary", "budget", "classification", "owner", "members", "events", "current_user")


class TripWriteSerializer(serializers.ModelSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
        source="owner",
    )
    startdate = serializers.DateField(required=False, allow_null=True)
    enddate = serializers.DateField(required=False, allow_null=True)
    budget = serializers.DecimalField(max_digits=14, decimal_places=2, required=False, allow_null=True)
    display_names = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    def validate(self, attrs: dict) -> dict:
        validated_data = super().validate(attrs)

        return validated_data

    def create(self, validated_data):
        create_these_members = []
        name = validated_data["name"]
        validated_data["startdate"] = validated_data.get("startdate")
        validated_data["enddate"] = validated_data.get("enddate")
        start_location = validated_data.get("start_location")
        summary = validated_data.get("summary")
        budget = validated_data.get("budget")
        display_names = validated_data.get("display_names")
        classification = validated_data.get("classification")
        owner_id = validated_data["owner_id"] = self.context['request'].user

        trip = Trip.objects.create(**validated_data)
        create_these_members.append(TripMember(trip=trip, user=CustomUser.objects.get(id=owner_id)))
        for member in display_names:
            create_these_members.append(TripMember(trip=trip, user=CustomUser.objects.get(display_name=member)))
        TripMember.objects.bulk_create(create_these_members)
        return trip

    class Meta:
        model = Trip
        exclude = ("id", )


class InlineTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ("id", "name")
        read_only_fields = ("id", "name")
