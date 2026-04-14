from codecs import register

from django.urls import path
from . import views
from .views import register,login_view

urlpatterns = [
    path('', views.home),
    path('register/', register),
    path('login/', login_view),
    path('me/', views.get_user),
    path('logout/', views.logout_view),
]