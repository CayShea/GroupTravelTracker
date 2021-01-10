# Generated by Django 3.1 on 2021-01-09 22:42

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('trips', '0005_auto_20201215_1720'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=64)),
                ('body', models.TextField(blank=True)),
                ('start', models.DateTimeField(blank=True, null=True)),
                ('end', models.DateTimeField(blank=True, null=True)),
                ('attending', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, null=True, size=None)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='trips.trip')),
            ],
        ),
    ]