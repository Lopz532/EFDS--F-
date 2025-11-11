from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# Construir lista de campos basada en lo que realmente tiene el modelo
model_field_names = {f.name for f in User._meta.get_fields() if hasattr(f, 'name')}
# Campos mínimos que siempre queremos exponer en el serializer
fields = ['id', 'username', 'email', 'first_name', 'last_name']
# añadir password (write_only) aunque no sea un campo del modelo (suele existir)
if 'password' not in fields:
    fields.append('password')
# si el modelo tiene 'role', agregarlo
if 'role' in model_field_names:
    fields.append('role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = tuple(fields)

    def create(self, validated_data):
        # quitar password del dict y crear el usuario con set_password
        password = validated_data.pop('password', None)
        # Si el modelo no tiene role, evitar pasarlo si no existe
        if 'role' in validated_data and 'role' not in model_field_names:
            validated_data.pop('role', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Mostrar campos que existan en el modelo (excluimos password)
        out_fields = ['id', 'username', 'email', 'first_name', 'last_name']
        if 'role' in model_field_names:
            out_fields.append('role')
        fields = tuple(out_fields)
