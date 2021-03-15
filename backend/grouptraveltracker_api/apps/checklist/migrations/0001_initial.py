# Generated by Django 3.1 on 2021-03-08 20:49

import apps.checklist.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('trips', '0007_auto_20210127_1007'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Checklist',
            fields=[
                ('id', models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, max_length=250, null=True)),
                ('isprivate', models.BooleanField(default=False)),
                ('date', models.DateField(auto_now=True)),
                ('assigned_to', models.CharField(blank=True, max_length=255, null=True)),
                ('is_done', models.BooleanField(default=False)),
                ('author', models.ForeignKey(default=apps.checklist.models.get_user_id, on_delete=django.db.models.deletion.CASCADE, related_name='checklists', to=settings.AUTH_USER_MODEL)),
                ('event', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='checklists', to='events.event')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checklists', to='trips.trip')),
            ],
        ),
    ]