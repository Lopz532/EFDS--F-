# core/urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('ping/', views.ping, name='ping'),
    path('auth/register/', views.register_view, name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', views.protected_view, name='protected'),
    from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/api/docs/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

]
