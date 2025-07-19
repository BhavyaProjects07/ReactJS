from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework.exceptions import ValidationError

class NoRedirectSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        # Allow all logins to signup via API
        return True

    def get_connect_redirect_url(self, request, socialaccount):
        raise ValidationError("No frontend redirect allowed")

    def get_login_redirect_url(self, request):
        raise ValidationError("No login redirect allowed")
