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

# ---------- Nuevos modelos para classroom/profile/audit -----------
from django.db import models
from django.conf import settings
from django.utils import timezone

class Classroom(models.Model):
    """
    Representa un salon / grupo / clase.
    """
    nombre = models.CharField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class StudentProfile(models.Model):
    """
    Perfil opcional para usuarios que son alumnos. Relacionado OneToOne con User.
    Contiene referencia a Classroom (salon).
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    # Puedes añadir más campos: grado, matricula, telefono, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile:{self.user.username}"

class DeletionLog(models.Model):
    """
    Registro de auditoría cuando se realiza un 'soft delete' sobre un usuario.
    """
    deleted_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='deletion_logs')
    deleted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='performed_deletions')
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"DeletionLog: {self.deleted_user} by {self.deleted_by} at {self.created_at}"

# ---------- Nuevos modelos para classroom/profile/audit -----------
from django.db import models
from django.conf import settings
from django.utils import timezone

class Classroom(models.Model):
    """
    Representa un salon / grupo / clase.
    """
    nombre = models.CharField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class StudentProfile(models.Model):
    """
    Perfil opcional para usuarios que son alumnos. Relacionado OneToOne con User.
    Contiene referencia a Classroom (salon).
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    # Puedes añadir más campos: grado, matricula, telefono, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile:{self.user.username}"

class DeletionLog(models.Model):
    """
    Registro de auditoría cuando se realiza un 'soft delete' sobre un usuario.
    """
    deleted_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='deletion_logs')
    deleted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='performed_deletions')
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"DeletionLog: {self.deleted_user} by {self.deleted_by} at {self.created_at}"

# signal to create StudentProfile automatically
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_profile_for_new_user(sender, instance, created, **kwargs):
    if created:
        # crea profile si no existe
        if not hasattr(instance, 'profile'):
            StudentProfile.objects.create(user=instance)
