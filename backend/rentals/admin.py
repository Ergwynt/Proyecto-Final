from django.contrib import admin

from .models import Rental

# Register your models here.


@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = (
        'rental_start_date',
        'rental_end_date',
        'is_active',
    )
