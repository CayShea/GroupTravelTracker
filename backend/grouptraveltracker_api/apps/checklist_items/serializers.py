from rest_framework import serializers
from django.db import transaction
import shortuuid
import logging
import requests
from .models import ChecklistItem
from .models import Checklist
from ..users.models import CustomUser
from ..trips.models import Trip
from ..events.models import Event

LOG = logging.getLogger(__name__)


class ChecklistItemsWriteSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        pk_field=serializers.UUIDField(format="hex_verbose"),
        write_only=True,
        required=False,
        source="author",
    )
    checklist_id = serializers.CharField(max_length=255)
    assigned_to_name = serializers.CharField(max_length=255, allow_blank=True, required=False)
    text = serializers.CharField(allow_blank=False, required=True)
    is_done = serializers.BooleanField(default=False)

    class Meta:
        model = ChecklistItem
        exclude = ('assigned_to', 'checklist')

    def validate(self, attrs):
        assigned_to_name = attrs.get("assigned_to_name", "")
        checklist_id = attrs.get("checklist_id", "")

        try:
            attrs["checklist"] = checklist = Checklist.objects.get(id=checklist_id)
        except:
            raise serializers.ValidationError("Checklist does not exist")
        if assigned_to_name:
            try:
                attrs["assigned_to"] = assigned_to = CustomUser.objects.get(display_name=assigned_to_name)
            except:
                raise serializers.ValidationError("Assigned user does not exist")
        return attrs
    
    def create(self, validated_data):
        validated_data["author_id"] = self.context['request'].user

        checklistItem = ChecklistItem.objects.create(**validated_data)
        return checklistItem

    def update(self, instance, validated_data):
        with transaction.atomic():
            assigned_to_name = validated_data.get("assigned_to_name", "")
            if instance.assigned_to and not validated_data.get('assigned_to') and assigned_to_name is not instance.assigned_to.display_name:
                validated_data['assigned_to'] = None

            item_data = dict(validated_data)
            checklist_items = super().update(instance, item_data)
            return checklist_items


class ChecklistItemsSerializer(serializers.ModelSerializer):
    author_photo = serializers.ImageField(source="author.photo", read_only=True, required=False)
    assigned_to_name = serializers.CharField(source="assigned_to.display_name", read_only=True, required=False)
    assigned_to_photo = serializers.ImageField(source="assigned_to.photo", read_only=True, required=False)

    class Meta:
        model = ChecklistItem
        fields = ('text', 'author_photo', 'id', 'assigned_to_name', 'assigned_to_photo', 'is_done', )


class InlineChecklistItemsSerializer(serializers.ModelSerializer):
    assigned_to_photo = serializers.ImageField(source="assigned_to.photo", read_only=True, required=False)
    assigned_to_name = serializers.CharField(source="assigned_to.display_name", read_only=True, required=False)

    class Meta:
        model = ChecklistItem
        fields = ("id", "text", "assigned_to_photo", "assigned_to_name", "is_done")