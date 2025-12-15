from .models import Submission, Materia, Tarea, Classroom
from .serializers import (
    SubmissionSerializer,
    MateriaSerializer,
    TareaSerializer,
    ClassroomSerializer,
)
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsTeacherOrReadOnly, _get_salon_from_user
from rest_framework import viewsets, status
from rest_framework.response import Response


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().select_related("alumno", "tarea")
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        qs = Submission.objects.all().select_related("alumno", "tarea")

        tarea_id = self.request.query_params.get("tarea")
        if tarea_id:
            qs = qs.filter(tarea_id=tarea_id)

        if getattr(user, "role", None) in ("teacher",) or user.is_staff:
            return qs.filter(tarea__creado_por=user)
        return qs.filter(alumno=user)

    def perform_create(self, serializer):
        serializer.save(alumno=self.request.user)


class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all().order_by("-created_at")
    serializer_class = MateriaSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre", "descripcion"]

    def get_queryset(self):
        user = self.request.user
        user_salon = _get_salon_from_user(user)

        if getattr(user, "role", None) == "student":
            if user_salon is None:
                return Materia.objects.none()
            return Materia.objects.filter(
                creado_por__profile__classroom=user_salon
            ).order_by("-created_at")

        if getattr(user, "role", None) == "teacher":
            return Materia.objects.filter(creado_por=user).order_by("-created_at")

        return Materia.objects.none()

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all().order_by("-created_at")
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["titulo", "descripcion"]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        materia_id = self.request.query_params.get("materia")
        if materia_id:
            qs = qs.filter(materia_id=materia_id)

        if getattr(user, "role", None) == "student":
            user_salon = _get_salon_from_user(user)
            if user_salon is None:
                return Tarea.objects.none()
            return qs.filter(
                materia__creado_por__profile__classroom=user_salon
            ).order_by("-created_at")

        if getattr(user, "role", None) == "teacher":
            return qs.filter(creado_por=user).order_by("-created_at")

        return Tarea.objects.none()

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


class ClassroomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Classroom.objects.all().order_by("nombre")
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]
