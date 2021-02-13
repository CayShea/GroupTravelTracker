from allauth.account.adapter import DefaultAccountAdapter
import logging

LOG = logging.getLogger(__name__)


class CustomUserAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        from allauth.account.utils import user_field

        user = super().save_user(request, user, form, False)
        user_field(user, 'display_name', request.data.get('display_name', ''))
        # user_field(user, 'photo', request.data.get('photo', ''))
        user.save()
        return user

        #  (<TemporaryUploadedFile: _A045762_3L.jpg (image/jpeg)>,)
        #   (<InMemoryUploadedFile: _DS33679n.jpg (image/jpeg)>,)