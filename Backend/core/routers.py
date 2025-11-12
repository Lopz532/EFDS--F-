from rest_framework.routers import DefaultRouter
from .viewsets import MateriaViewSet, TareaViewSet

router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materia')
router.register(r'tareas', TareaViewSet, basename='tarea')
