from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .viewsets import MateriaViewSet, TareaViewSet
from .auth_views import LogoutView

# Routers para ViewSets
router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materias')
router.register(r'tareas', TareaViewSet, basename='tareas')

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("auth/register/", views.RegisterView.as_view(), name="auth-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("protected/", views.protected_view, name="protected"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", views.me_view, name="auth-me"),
    path("api/", include(router.urls)),  # <-- Aquí se añaden materias y tareas
]
