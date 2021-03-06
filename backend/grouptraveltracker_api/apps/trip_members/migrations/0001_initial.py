# Generated by Django 3.1 on 2020-12-16 00:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('trips', '0005_auto_20201215_1720'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TripMember',
            fields=[
                ('id', models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='trips.trip')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
