from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
import logging
LOG = logging.getLogger(__name__)


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    use_in_migrations = True

    def create_user(self, email, password, display_name, photo, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        self.cleaned_data = self.get_cleaned_data()
        email = self.normalize_email(email)
        user = self.model(email=email, display_name=display_name, **extra_fields)
        user.display_name = self.cleaned_data('display_name')
        user.photo = self.cleaned_data('photo')
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, display_name, photo, password):
        user = self.create_user(
            email,
            password=password,        
            display_name=display_name,
            photo=photo,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, display_name, photo, password):
        user = self.create_user(
            email,
            password=password,
            display_name= display_name,
            photo=photo,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user