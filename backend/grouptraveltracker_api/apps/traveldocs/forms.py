from django import forms
from allauth.account.forms import SetPasswordField, PasswordField
from .models import Traveldocs


class FileForm(forms.ModelForm):
    class Meta:
        model= Traveldocs
        fields= ["isprivate", "trip", "event", "note", "name", "filepath"]
