from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Classroom, StudentProfile, DeletionLog


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "created_at")


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "classroom", "created_at")


@admin.register(DeletionLog)
class DeletionLogAdmin(admin.ModelAdmin):
    list_display = ("id", "deleted_user", "deleted_by", "created_at", "reason")
