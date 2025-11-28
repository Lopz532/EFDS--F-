from rest_framework.permissions import BasePermission, SAFE_METHODS


def _get_salon_from_user(u):
    """
    Intenta sacar el 'salon' de un user.
    Soporta varias estructuras comunes:
    - user.salon
    - user.classroom
    - user.profile.salon
    - user.profile.classroom
    Devuelve None si no se puede determinar.
    """
    if u is None:
        return None
    for attr in ("salon", "classroom", "group", "room"):
        v = getattr(u, attr, None)
        if v is not None:
            return v
    profile = getattr(u, "profile", None)
    if profile is not None:
        for attr in ("salon", "classroom", "group", "room"):
            v = getattr(profile, attr, None)
            if v is not None:
                return v
    return None


class IsTeacherOrReadOnly(BasePermission):
    """
    Permite solo métodos de lectura a cualquiera;
    métodos no seguros sólo a teachers (o staff).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if hasattr(user, "role"):
            return getattr(user, "role") == "teacher"
        return user.is_staff


class CanDeleteUser(BasePermission):
    """
    Solo permite eliminar usuarios bajo ciertas condiciones:
    - Admin siempre puede
    - Profesor puede eliminar alumnos de su salón
    """

    def has_permission(self, request, view):
        if request.method != "DELETE":
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Admin siempre puede
        if user.is_staff or user.is_superuser:
            return True

        role = getattr(user, "role", None)
        is_teacher = (role == "teacher") or getattr(user, "is_staff", False)
        if not is_teacher:
            return False

        target_role = getattr(obj, "role", None)
        target_is_teacher_or_staff = (target_role == "teacher") or getattr(obj, "is_staff", False)
        if target_is_teacher_or_staff:
            return False

        # Evitar borrarse a sí mismo
        if obj.pk == user.pk:
            return False

        prof_salon = _get_salon_from_user(user)
        target_salon = _get_salon_from_user(obj)

        if prof_salon is None or target_salon is None:
            return False

        return str(prof_salon) == str(target_salon)


class IsOwnerOrTeacher(BasePermission):
    """
    Para Materias y Tareas:
    - Lectura: alumnos solo ven si la materia es de su salón
    - Escritura: solo profesores o admins
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in SAFE_METHODS:
            if getattr(user, "role", None) == "student":
                # Alumno ve solo si pertenece al salón de la materia
                target_salon = getattr(obj.materia, "salones", None)
                user_salon = _get_salon_from_user(user)
                if target_salon is None or user_salon is None:
                    return False
                return user_salon in target_salon.all()
            return True

        # Escritura solo profesores
        if getattr(user, "role", None) == "teacher" or user.is_staff:
            return True
        return False
