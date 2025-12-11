from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Materia, Tarea, StudentProfile, Classroom, Submission

User = get_user_model()

# ---------------- SubmissionSerializer (única, permite archivo) ----------------
class SubmissionSerializer(serializers.ModelSerializer):
    alumno_name = serializers.CharField(source="alumno.username", read_only=True)
    archivo = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Submission
        fields = [
            "id",
            "tarea",
            "alumno",
            "alumno_name",
            "archivo",
            "comentario",
            "created_at",
            "entregado",
        ]
        read_only_fields = ["alumno", "created_at", "alumno_name"]

# ---------------- Usuario / Registro ----------------
model_field_names = {f.name for f in User._meta.get_fields() if hasattr(f, "name")}
fields = ["id", "username", "email", "first_name", "last_name", "password"]
if "role" in model_field_names:
    fields.append("role")

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = tuple(fields)

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        out_fields = ["id", "username", "email", "first_name", "last_name"]
        if "role" in model_field_names:
            out_fields.append("role")
        fields = tuple(out_fields)

# ---------------- Materia / Tarea / Classroom ----------------
class MateriaSerializer(serializers.ModelSerializer):
    profesor_name = serializers.CharField(source="creado_por.username", read_only=True)

    class Meta:
        model = Materia
        fields = [
            "id",
            "nombre",
            "descripcion",
            "creado_por",
            "profesor_name",
            "created_at",
        ]
        read_only_fields = ["creado_por", "created_at"]


class TareaSerializer(serializers.ModelSerializer):
    profesor_name = serializers.CharField(source="creado_por.username", read_only=True)
    materia_name = serializers.CharField(source="materia.nombre", read_only=True)

    class Meta:
        model = Tarea
        fields = [
            "id",
            "titulo",
            "descripcion",
            "materia",
            "materia_name",
            "fecha_entrega",
            "creado_por",
            "profesor_name",
            "archivo",
            "created_at",
        ]
        read_only_fields = ["creado_por", "created_at"]


class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ["id", "nombre", "descripcion", "created_at"]