# from django.contrib.auth.forms import UserCreationForm
from django import forms
from allauth.account.forms import SetPasswordField, PasswordField
from .models import CustomUser


class RegistrationForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={"class": "input_text", }), required=True,)
    password1 = SetPasswordField()
    password2 = PasswordField()
    display_name = forms.CharField(max_length=100)
    photo = forms.ImageField(required=False,)

    class Meta:
        model = CustomUser
        fields = ["display_name", "email", "photo", "password1", "password2"]

    def signup(self, request, user):
        # user = super(RegistrationForm, self).save(commit=False)
        user.display_name = self.cleaned_data['display_name']
        user.photo = self.cleaned_data['photo']
        user.email = self.cleaned_data['email']
        user.save()