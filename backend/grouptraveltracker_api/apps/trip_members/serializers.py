import logging
import uuid
import shortuuid
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from asgiref.sync import async_to_sync

from ..trips.models import Trip
from ..trips.serializers import InlineTripSerializer
from ..users.models import CustomUser
from ..events.models import Event
from .models import TripMember

LOG = logging.getLogger(__name__)


class TripMemberWriteSerializer(serializers.Serializer):
    trip_id = serializers.CharField(max_length=255, default=shortuuid.uuid)
    display_name = serializers.ListField(
        child=serializers.CharField(required=False, allow_null=False),
        required=False,
        allow_empty=True,
    )

    def validate(self, attrs):
        trip_id = attrs["trip_id"]
        display_name = attrs.get("display_name", [])

        try:
            attrs["trip"] = trip = Trip.objects.get(id=trip_id)
        except:
            raise serializers.ValidationError("Trip Id does not exist")
        try:
            attrs["trip_members"] = CustomUser.objects.filter(display_name__in=display_name).distinct()
        except:
            serializers.ValidationError("User does not exist, cannot add to Trip.")
        # TECH Debt- need to add-in error handling to check EACH display_name passed in- alert user if one of them does not exist. For now, they are just ignored.
        return attrs
    
    def create(self, validated_data):
        display_name = validated_data["display_name"]
        trip = validated_data["trip"]
        trip_members = validated_data["trip_members"]

        with transaction.atomic():
            current_trip_members = TripMember.objects.filter(trip=trip).values_list("user__display_name", flat=True).distinct()

            if current_trip_members:
                request_members = trip_members.values_list("display_name", flat=True).distinct()
                new_members = [x for x in request_members if x not in current_trip_members]
                remove_members = [x for x in current_trip_members if x not in request_members]

                if new_members:
                    for new_member in new_members:
                        create_these_members = []
                        create_these_members.append(TripMember(trip=trip, user=CustomUser.objects.get(display_name=new_member)))
                        TripMember.objects.bulk_create(create_these_members)
                if remove_members:
                    delete_these_members = TripMember.objects.filter(trip=trip, user__display_name__in=remove_members)
                    delete_these_members.delete()
                if not new_members and not remove_members:
                    return {}
            else:
                for new_member in trip_members:
                    create_these_members = []
                    create_these_members.append(TripMember(trip=trip, user=new_member))
                    TripMember.objects.bulk_create(create_these_members)
            return {}


class InlineUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("display_name", )
        read_only_fields = ("display_name", )


class TripMemberSerializer(serializers.ModelSerializer):
    trip = serializers.CharField(source="trip.name", read_only=True)
    user = InlineUserSerializer(read_only=True)

    class Meta:
        model = TripMember
        fields = "__all__"
        read_only_fields = ("id", )
