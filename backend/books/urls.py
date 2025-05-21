from django.urls import path

from . import views

app_name = 'books'

urlpatterns = [
    path('', views.book_list, name='book-list'),
    path('create/', views.create_book, name='create-book'),
    path('<str:isbn>/', views.book_detail, name='book-detail'),
    path('<str:isbn>/update/', views.update_book, name='update-book'),
]
