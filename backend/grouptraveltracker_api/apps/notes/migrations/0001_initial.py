# Generated by Django 3.1 on 2021-02-26 01:35

import apps.notes.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0004_auto_20210127_1007'),
        ('trips', '0007_auto_20210127_1007'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, max_length=250, null=True)),
                ('body', models.CharField(blank=True, max_length=500, null=True)),
                ('isprivate', models.BooleanField(default=False)),
                ('date', models.DateField(auto_now=True)),
                ('author', models.ForeignKey(default=apps.notes.models.get_user_id, on_delete=django.db.models.deletion.CASCADE, related_name='notes', to=settings.AUTH_USER_MODEL)),
                ('event', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='events.event')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='trips.trip')),
            ],
        ),
    ]
