from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()
model_field_names = {f.name for f in User._meta.get_fields() if hasattr(f, 'name')}
fields = ['id', 'username', 'email', 'first_name', 'last_name']
fields.append('password')
if 'role' in model_field_names:
    fields.append('role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = tuple(fields)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        out_fields = ['id', 'username', 'email', 'first_name', 'last_name']
        if 'role' in model_field_names:
            out_fields.append('role')
        fields = tuple(out_fields)

from rest_framework import serializers
from .models import Materia, Tarea

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id','nombre','descripcion','creado_por','created_at']
        read_only_fields = ['creado_por','created_at']

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = ['id','titulo','descripcion','materia','fecha_entrega','creado_por','archivo','created_at']
        read_only_fields = ['creado_por','created_at']
