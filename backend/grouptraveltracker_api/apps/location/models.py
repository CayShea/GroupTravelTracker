import shortuuid
from django.db import models


class Location(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    title = models.CharField(max_length=60, blank=True, null=True)
    lat = models.DecimalField(max_digits = 8, decimal_places = 5, blank=True, null=True)
    lng = models.DecimalField(max_digits = 8, decimal_places = 5, blank=True, null=True)

    def __str__(self):
        return self.title