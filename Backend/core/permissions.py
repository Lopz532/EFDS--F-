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
    # directo
    for attr in ("salon", "classroom", "group", "room"):
        v = getattr(u, attr, None)
        if v is not None:
            return v
    # perfil relacionado
    profile = getattr(u, "profile", None)
    if profile is not None:
        for attr in ("salon", "classroom", "group", "room"):
            v = getattr(profile, attr, None)
            if v is not None:
                return v
    return None


class IsTeacherOrReadOnly(BasePermission):
    """
    Permite solo métodos de lectura a cualquiera; métodos no seguros sólo a teachers (o staff).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # preferir campo 'role' si existe
        if hasattr(user, "role"):
            return getattr(user, "role") == "teacher"
        return user.is_staff


class CanDeleteUser(BasePermission):
    """
    Permiso para DELETE sobre usuarios.

    Reglas:
    - ADMIN (is_staff o is_superuser) -> puede eliminar cualquier usuario.
    - PROFESOR (role == 'teacher' o is_staff fallback) -> solo puede eliminar usuarios que:
        * sean alumnos (no otros teachers/admins), Y
        * pertenezcan AL MISMO salon que el profesor.
      Esto evita que un profesor borre alumnos de otros salones.
    - Cualquier otro usuario -> no puede eliminar.
    - Si no se puede determinar el 'salon' del profesor o del objetivo -> denegar por seguridad.
    """

    def has_permission(self, request, view):
        # No interferimos en otros métodos: solo aplicamos para DELETE
        if request.method != "DELETE":
            return True
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        """
        obj: instancia de User objetivo
        request.user: quien hace la petición
        """
        user = request.user

        # Admin siempre puede (staff o superuser)
        if user.is_staff or user.is_superuser:
            return True

        # Profesor?
        role = getattr(user, "role", None)
        is_teacher = (
            role == "teacher"
        ) or user.is_staff is True  # si no hay role, is_staff puede indicar permiso
        if not is_teacher:
            return False

        # No permitir a profesor eliminar a otros profesores/admins
        target_role = getattr(obj, "role", None)
        target_is_teacher_or_staff = (target_role == "teacher") or getattr(
            obj, "is_staff", False
        )
        if target_is_teacher_or_staff:
            return False

        # Evitar que se borre a sí mismo
        if obj.pk == user.pk:
            return False

        # Comparar salones: profesor debe poder borrar SOLO alumnos de SU salón
        prof_salon = _get_salon_from_user(user)
        target_salon = _get_salon_from_user(obj)

        if prof_salon is None or target_salon is None:
            # si no hay info suficiente, denegar (seguridad primero)
            return False

        # Permitir sólo si son el mismo salón
        return str(prof_salon) == str(target_salon)
