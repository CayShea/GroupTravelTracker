import shortuuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from ..users.managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    id = models.CharField(primary_key=True, max_length=255, default=shortuuid.uuid, db_index=True)
    email = models.EmailField(_('email address'), unique=True)
    display_name = models.CharField(unique=True, max_length=100)
    photo = models.ImageField(verbose_name=_("Photo"), upload_to='photos/', default='photos/default-user-avatar.png')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name', ]

    objects = CustomUserManager()

    def __str__(self):
        return self.display_name
