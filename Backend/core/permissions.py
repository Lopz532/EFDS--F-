from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTeacherOrReadOnly(BasePermission):
    """
    Allow safe methods for everyone. For unsafe methods require user.role == 'teacher'
    If the user model has no 'role' field, fallback to is_staff.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # prefer role if exists
        if hasattr(user, 'role'):
            return getattr(user, 'role') == 'teacher'
        return user.is_staff
