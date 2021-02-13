# Generated by Django 3.1 on 2021-01-27 00:06

import apps.users.managers
from django.db import migrations, models
import shortuuid.main


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20201222_1624'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='customuser',
            managers=[
                ('objects', apps.users.managers.CustomUserManager()),
            ],
        ),
    ]