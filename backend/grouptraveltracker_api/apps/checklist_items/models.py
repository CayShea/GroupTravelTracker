from django.db import models
import shortuuid
from ..checklist.models import Checklist
from ..users.models import CustomUser
from ..auth.middleware import get_current_user


def get_user_id():
    user = get_current_user()
    if user:
        if user.is_authenticated:
            return get_current_user().id


class ChecklistItem(models.Model):
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    checklist = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name="items")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=get_user_id, related_name="checklist_items")
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="assigned_checklist_items", blank=True, null=True)
    text = models.CharField(max_length=250, blank=True, null=True)
    date = models.DateField(auto_now=True)
    is_done = models.BooleanField(default=False)
