from django.db import models
from django.utils import timezone
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


class Checklist(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=get_user_id, related_name="checklists")
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="assigned_checklists", blank=True, null=True)
    title = models.CharField(max_length=250, unique=True, default=timezone.now())
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="checklists")
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="checklists", blank=True, null=True)
    isprivate = models.BooleanField(default=False)
    date = models.DateField(auto_now=True)
    is_done = models.BooleanField(default=False)
