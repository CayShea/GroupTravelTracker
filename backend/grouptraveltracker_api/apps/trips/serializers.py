from rest_framework import serializers
from .models import Trip, CustomUser
from .extensions.serializers import InlineTripMemberSerializer
import logging

LOG = logging.getLogger(__name__)


class TripSerializer(serializers.ModelSerializer):
    owner = InlineTripMemberSerializer(read_only=True)
    name = serializers.CharField(max_length=64)
    budget = serializers.DecimalField(max_digits=14, decimal_places=2, required=False, allow_null=True)
    startdate = serializers.DateField(required=False, allow_null=True)
    enddate = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Trip
        fields = '__all__'


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

    def validate(self, attrs: dict) -> dict:
        validated_data = super().validate(attrs)

        return validated_data

    def create(self, validated_data):
        name = validated_data["name"]
        validated_data["startdate"] = validated_data.get("startdate")
        validated_data["enddate"] = validated_data.get("enddate")
        start_location = validated_data.get("start_location")
        summary = validated_data.get("summary")
        budget = validated_data.get("budget")
        classification = validated_data.get("classification")
        validated_data["owner_id"] = (CustomUser(id=self.context['request'].user)).id

        trip = Trip.objects.create(**validated_data)
        return trip

    class Meta:
        model = Trip
        exclude = ("id", )
