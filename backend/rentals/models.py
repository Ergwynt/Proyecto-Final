from django.conf import settings
from django.db import models
from django.utils import timezone

from books.models import Book  # Importa el modelo Book


class Rental(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rental_start_date = models.DateTimeField(auto_now_add=True)
    rental_end_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'Rental of {self.book.title} by {self.user.username}'

    def is_overdue(self):
        """Método para comprobar si la renta ha vencido."""
        return self.rental_end_date < timezone.now() and self.is_active
