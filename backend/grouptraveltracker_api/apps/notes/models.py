from django.db import models
import shortuuid
from ..trips.models import Trip
from ..events.models import Event
from ..users.models import CustomUser
from ..auth.middleware import get_current_user


def get_user_id():
    user = get_current_user()
    if user:
        if user.is_authenticated:
            return get_current_user().id


class Note(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=get_user_id, related_name="notes")
    title = models.CharField(max_length=250, blank=True, null=True)
    body = models.CharField(max_length=500, blank=True, null=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="notes")
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="notes", blank=True, null=True)
    isprivate = models.BooleanField(default=False)
    date = models.DateField(auto_now=True)
