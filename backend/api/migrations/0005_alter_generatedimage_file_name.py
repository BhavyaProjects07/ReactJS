# Generated by Django 5.2.4 on 2025-07-25 12:56

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='generatedimage',
            name='file_name',
            field=cloudinary.models.CloudinaryField(max_length=255, verbose_name='image'),
        ),
    ]
