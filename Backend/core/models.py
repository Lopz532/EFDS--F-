# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (('student', 'Student'), ('teacher', 'Teacher'))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.username} ({self.role})"

from django.db import models
from django.conf import settings

class Materia(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='materias_creadas')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Tarea(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='tareas')
    fecha_entrega = models.DateTimeField(null=True, blank=True)
    creado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='tareas_creadas')
    archivo = models.FileField(upload_to='tareas_archivos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
