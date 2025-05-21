from django.urls import path

from . import views

app_name = 'users'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.get_profile, name='get-profile'),
    path('update/', views.update_profile, name='update-profile'),
]
