from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('ping/', views.ping, name='ping'),
    path('auth/register/', views.RegisterView.as_view(), name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', views.protected_view, name='protected'),
]

from .auth_views import LogoutView
urlpatterns += [
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
]
