from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
import logging

from .models import CustomUser

LOG = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'display_name', 'photo')


class CustomRegisterSerializer(RegisterSerializer):

    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    display_name = serializers.CharField(required=True)
    photo = serializers.ImageField(required=False)

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()

        return {
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'display_name': self.validated_data.get('display_name', ''),
            'photo': self.validated_data.get('photo', ''),
        }
