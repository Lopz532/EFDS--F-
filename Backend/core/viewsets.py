from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Materia, Tarea
from .serializers import MateriaSerializer, TareaSerializer
from .permissions import IsTeacherOrReadOnly, _get_salon_from_user

class MateriaViewSet(viewsets.ModelViewSet):
    serializer_class = MateriaSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Alumno: filtra por su salón
        user_salon = _get_salon_from_user(user)
        if getattr(user, "role", None) == "student":
            return Materia.objects.filter(creado_por__profile__salon=user_salon)
        # Profesor: filtra solo materias que creó
        elif getattr(user, "role", None) == "teacher":
            return Materia.objects.filter(creado_por=user)
        return Materia.objects.none()

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


class TareaViewSet(viewsets.ModelViewSet):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Alumno: solo tareas de materias de su salón
        user_salon = _get_salon_from_user(user)
        if getattr(user, "role", None) == "student":
            return Tarea.objects.filter(materia__creado_por__profile__salon=user_salon)
        # Profesor: solo tareas creadas por él
        elif getattr(user, "role", None) == "teacher":
            return Tarea.objects.filter(creado_por=user)
        return Tarea.objects.none()

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)
