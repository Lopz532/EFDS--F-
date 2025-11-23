# core/viewsets_audit.py
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.serializers import ModelSerializer
from .models import DeletionLog


class DeletionLogSerializer(ModelSerializer):
    class Meta:
        model = DeletionLog
        fields = ["id", "deleted_user", "deleted_by", "reason", "created_at"]


class DeletionLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Solo lectura (admin). Lista los logs de eliminación (auditoría).
    GET /api/deletion-logs/
    """

    queryset = (
        DeletionLog.objects.select_related("deleted_user", "deleted_by")
        .all()
        .order_by("-created_at")
    )
    serializer_class = DeletionLogSerializer
    permission_classes = [IsAdminUser]
