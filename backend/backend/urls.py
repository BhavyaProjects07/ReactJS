from django.contrib import admin
from django.urls import path, include
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
from api import views

# ✅ Google Login View Class
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter


def home(request):
    return HttpResponse("Welcome to Dark AI Backend!")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    # ✅ Your main API endpoints
    path('api/', include('api.urls')),

    path('api/ping/', views.ping_view),
]


# ✅ Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)