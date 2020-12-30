import shortuuid
from django.db import models
from ..users.models import CustomUser
from ..trips.models import Trip
from ..auth.middleware import get_current_user


class TripMember(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="users")
