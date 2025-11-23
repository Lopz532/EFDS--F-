# core/routers.py
from rest_framework.routers import DefaultRouter

# viewsets principales
from .viewsets import MateriaViewSet, TareaViewSet

# viewsets adicionales (asegúrate que estos archivos existen)
# UserViewSet está en core/viewsets_users.py según tu repo
from .viewsets_users import UserViewSet
from .viewsets_audit import DeletionLogViewSet

router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materia')
router.register(r'tareas', TareaViewSet, basename='tarea')

# Registrar users y logs de auditoría
router.register(r'users', UserViewSet, basename='user')
router.register(r'deletion-logs', DeletionLogViewSet, basename='deletionlog')
