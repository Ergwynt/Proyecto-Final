from django.urls import path

from . import views

app_name = 'rentals'

urlpatterns = [
    path('', views.rent_list_user, name='rent-list'),
    path('rent/', views.rent_book, name='rent-book'),
    path('return/', views.return_book, name='return-book'),
]
