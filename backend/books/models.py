from django.db import models
from django.utils.text import slugify


class Book(models.Model):
    CATEGORY_CHOICES = [
        ('fantasy', 'Fantasía'),
        ('scifi', 'Ciencia Ficción'),
        ('horror', 'Terror'),
        ('thriller', 'Suspenso'),
        ('historical', 'Histórica'),
        ('classic', 'Clásico'),
        ('manga', 'Manga'),
    ]

    isbn = models.CharField(max_length=13, unique=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover = models.ImageField(upload_to='covers/', blank=True)
    available = models.BooleanField(default=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='fantasy')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Book'
        verbose_name_plural = 'Books'
