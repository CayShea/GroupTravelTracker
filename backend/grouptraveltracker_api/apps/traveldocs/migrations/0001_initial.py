# Generated by Django 3.1 on 2021-02-22 18:11

from django.db import migrations, models
import django.db.models.deletion
import shortuuid.main


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('events', '0001_initial'),
        ('trips', '0007_auto_20210127_1007'),
    ]

    operations = [
        migrations.CreateModel(
            name='Traveldocs',
            fields=[
                ('id', models.CharField(db_index=True, default=shortuuid.main.ShortUUID.uuid, max_length=255, primary_key=True, serialize=False)),
                ('filepath', models.FileField(null=True, upload_to='files/', verbose_name='')),
                ('isprivate', models.BooleanField(default=False)),
                ('name', models.CharField(blank=True, max_length=250, null=True)),
                ('note', models.CharField(blank=True, max_length=500, null=True)),
                ('event', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='events.event')),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='trips.trip')),
            ],
        ),
    ]