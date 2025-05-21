from django.contrib import admin

from .models import Book

# Register your models here.


@admin.register(Book)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('isbn', 'title', 'slug', 'author', 'description', 'available', 'category')
