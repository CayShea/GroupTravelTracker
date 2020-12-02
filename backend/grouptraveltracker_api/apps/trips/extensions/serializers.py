from rest_framework import serializers
from ..models import Trip, CustomUser
import logging

LOG = logging.getLogger(__name__)


class InlineTripMemberSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="customuser.display_name", read_only=True)
    email = serializers.EmailField(source="customuser.email", read_only=True)

    class Meta:
        model = CustomUser
        ref_name = None
        fields = ("id", "email", "display_name")
        read_only_fields = ("id", "email", "display_name")