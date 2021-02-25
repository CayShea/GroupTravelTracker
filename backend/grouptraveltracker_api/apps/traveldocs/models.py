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


class Traveldocs(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    filepath= models.FileField(upload_to='files/', null=True, verbose_name="")
    isprivate = models.BooleanField(default=False)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=get_user_id, related_name="owned_traveldocs")
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="documents", blank=True, null=True)
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="documents", blank=True, null=True)
    name= models.CharField(max_length=250, blank=True, null=True)
    note= models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name + ": " + str(self.filepath)
