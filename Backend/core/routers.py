from rest_framework.routers import DefaultRouter
from .viewsets import MateriaViewSet, TareaViewSet
# si necesitas exponer UserViewSet vía router, importa desde viewsets_users.py:
# from .viewsets_users import UserViewSet

router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materia')
router.register(r'tareas', TareaViewSet, basename='tarea')
# router.register(r'users', UserViewSet, basename='user')  # opcional
