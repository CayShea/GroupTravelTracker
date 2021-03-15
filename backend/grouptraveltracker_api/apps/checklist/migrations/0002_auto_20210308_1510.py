# Generated by Django 3.1 on 2021-03-08 22:10

import datetime
from django.db import migrations, models
from django.utils.timezone import utc
import shortuuid.main


class Migration(migrations.Migration):

    dependencies = [
        ('checklist', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='checklist',
            name='id',
            field=models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='checklist',
            name='title',
            field=models.CharField(default=datetime.datetime(2021, 3, 8, 22, 10, 43, 98081, tzinfo=utc), max_length=250, unique=True),
        ),
    ]