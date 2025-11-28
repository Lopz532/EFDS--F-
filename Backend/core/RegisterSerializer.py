from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, Classroom

User = get_user_model()

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=(("teacher","teacher"),("student","student")))
    classroom_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        if data["role"] == "student" and not data.get("classroom_id"):
            raise serializers.ValidationError({"classroom_id":"required for student"})
        return data

    def create(self, validated_data):
        pwd = validated_data.pop("password")
        classroom_id = validated_data.pop("classroom_id", None)
        role = validated_data.get("role")

        # no permitir crear staff/superuser desde aquí
        user = User(username=validated_data["username"], role=role)
        user.set_password(pwd)
        user.is_active = True
        user.save()

        if role == "student" and classroom_id is not None:
            classroom = Classroom.objects.get(pk=classroom_id)
            StudentProfile.objects.create(user=user, classroom=classroom)

        return user
