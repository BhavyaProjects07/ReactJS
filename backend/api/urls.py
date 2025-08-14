from django.urls import path
from api import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('chat/', views.ChatAPIView.as_view(), name='chat-api'),
    path('generate-image/', views.GenerateImageAPIView.as_view(), name='generate-image'),
    path("text-to-speech/", views.TextToSpeechView.as_view(), name="text-to-speech"),
    path("auth/", views.auth_view, name="auth"),   # signup, verify, signin in one
    path("logout/", views.logout_view, name="logout"),
    path("ping/", views.ping_view, name="ping"),
]  
