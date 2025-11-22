from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .permissions import CanDeleteUser
from rest_framework.permissions import IsAuthenticated
from .models import DeletionLog

User = get_user_model()

class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, CanDeleteUser]

    def destroy(self, request, pk=None):
        try:
            user = self.get_object()
        except Exception:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # chequeo de permisos por objeto
        self.check_object_permissions(request, user)

        # evitar que se borre a sí mismo accidentalmente
        if user == request.user and not request.user.is_superuser:
            return Response({"detail": "No puedes eliminarte a ti mismo."}, status=status.HTTP_400_BAD_REQUEST)

        # Soft-delete: marcar is_active = False (evita pérdida permanente)
        user.is_active = False
        user.save()

        # Crear registro de auditoría (puedes añadir motivo en el body si lo deseas)
        reason = request.data.get('reason', '')
        DeletionLog.objects.create(deleted_user=user, deleted_by=request.user, reason=reason)

        return Response(status=status.HTTP_204_NO_CONTENT)
