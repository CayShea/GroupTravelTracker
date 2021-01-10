import shortuuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from ..trips.models import Trip
from ..trip_members.models import TripMember


class Event(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    title = models.CharField(max_length=64)
    body = models.TextField(blank=True)
    start = models.DateTimeField(null=True, blank=True)
    end = models.DateTimeField(null=True, blank=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="events")
    attending = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    