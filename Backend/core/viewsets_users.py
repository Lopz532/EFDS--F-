from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .permissions import CanDeleteUser
from rest_framework.permissions import IsAuthenticated
from .models import DeletionLog
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser

User = get_user_model()


class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CanDeleteUser]  # Para destroy

    def destroy(self, request, pk=None):
        try:
            user = self.get_object()
        except Exception:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, user)

        if user == request.user and not request.user.is_superuser:
            return Response(
                {"detail": "No puedes eliminarte a ti mismo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = False
        user.save()

        reason = request.data.get("reason", "")
        DeletionLog.objects.create(
            deleted_user=user, deleted_by=request.user, reason=reason
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

    # 🔥🔥🔥 AGREGA ESTO AL FINAL DE LA CLASE
    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def restore(self, request, pk=None):
        """
        Admin-only: restaura un usuario marcado con is_active=False.
        POST /api/users/{id}/restore/
        """
        try:
            user = self.get_object()
        except Exception:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return Response(
                {"detail": "User is already active."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.save()

        return Response({"detail": "User restored."}, status=status.HTTP_200_OK)
