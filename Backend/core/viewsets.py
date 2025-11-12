from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Materia, Tarea
from .serializers import MateriaSerializer, TareaSerializer
from .permissions import IsTeacherOrReadOnly

class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all().order_by('-created_at')
    serializer_class = MateriaSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all().order_by('-created_at')
    serializer_class = TareaSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)
