# Generated by Django 3.1 on 2021-02-24 19:36

import apps.traveldocs.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0007_auto_20210127_1007'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('traveldocs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='traveldocs',
            name='owner',
            field=models.ForeignKey(default=apps.traveldocs.models.get_user_id, on_delete=django.db.models.deletion.CASCADE, related_name='owned_traveldocs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='traveldocs',
            name='id',
            field=models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='traveldocs',
            name='trip',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='trips.trip'),
        ),
    ]