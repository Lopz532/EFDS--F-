from rest_framework import viewsets
from .models import Materia, Tarea
from .serializers import MateriaSerializer, TareaSerializer
from .permissions import IsTeacherOrReadOnly

class MateriaViewSet(viewsets.ModelViewSet):
    """
    CRUD para Materia.
    Lectura abierta (GET) por defecto; creación/edición/eliminación solo para profesores/admin.
    """
    queryset = Materia.objects.all().order_by('-created_at')
    serializer_class = MateriaSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

class TareaViewSet(viewsets.ModelViewSet):
    """
    CRUD para Tarea.
    Lectura pública/autenticada según tu permiso; creación solo por profesores/admin.
    """
    queryset = Tarea.objects.all().order_by('-created_at')
    serializer_class = TareaSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)
