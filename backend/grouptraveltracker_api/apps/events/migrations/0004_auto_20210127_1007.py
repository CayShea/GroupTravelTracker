# Generated by Django 3.1 on 2021-01-27 17:07

from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    dependencies = [
        ('location', '0002_auto_20210127_1007'),
        ('events', '0003_auto_20210126_1653'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='events', to='location.location'),
        ),
    ]
