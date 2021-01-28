import shortuuid
from django.db import models
from .field_choices import TripClassification
from ..users.models import CustomUser
from ..location.models import Location
from ..auth.middleware import get_current_user
import logging

LOG = logging.getLogger(__name__)

def get_user_id():
    user = get_current_user()
    if user:
        if user.is_authenticated:
            return get_current_user().id

class Trip(models.Model):
    name = models.CharField(max_length=64)
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    startdate = models.DateField(null=True, blank=True)
    enddate = models.DateField(null=True, blank=True)
    location = models.OneToOneField(Location, on_delete=models.CASCADE, related_name="trips", blank=True, null=True)
    summary = models.TextField(blank=True)
    budget = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    classification = models.CharField(max_length=35, choices=TripClassification.choices)
    owner =  models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=get_user_id, related_name="user_trips")
