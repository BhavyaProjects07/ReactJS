# models.py
from django.db import models
from cloudinary.models import CloudinaryField
class GeneratedImage(models.Model):
    prompt = models.TextField()
    file_name = CloudinaryField('image')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt
