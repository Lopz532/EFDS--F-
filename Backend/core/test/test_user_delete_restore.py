# core/tests/test_user_delete_restore.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from core.models import DeletionLog

User = get_user_model()


class UserDeleteRestoreAPITest(TestCase):
    def setUp(self):
        # usuarios
        self.admin = User.objects.create_user(username="admin_ci", password="adminpass")
        self.admin.is_staff = True
        self.admin.is_superuser = True
        self.admin.save()

        self.teacher = User.objects.create_user(
            username="teacher_ci", password="teacherpass"
        )
        self.student = User.objects.create_user(
            username="student_ci", password="studentpass"
        )

        # cliente API
        self.client = APIClient()

    def test_soft_delete_and_restore_flow(self):
        # autenticar como admin
        self.client.force_authenticate(user=self.admin)

        # DELETE (soft) al estudiante
        url_delete = f"/api/users/{self.student.pk}/"
        resp = self.client.delete(url_delete)
        # Según tu implementación devolvía 204, aceptamos 200/204
        self.assertIn(
            resp.status_code,
            (200, 204),
            msg=f"delete status {resp.status_code} / {resp.content!r}",
        )

        # el usuario debe quedar inactivo
        student = User.objects.get(pk=self.student.pk)
        self.assertFalse(
            student.is_active, "student should be deactivated after delete"
        )

        # Debe existir un DeletionLog apuntando al usuario
        logs = DeletionLog.objects.filter(deleted_user=self.student.pk)
        self.assertTrue(logs.exists(), "DeletionLog entry must be created on delete")

        # Restore via endpoint
        url_restore = f"/api/users/{self.student.pk}/restore/"
        resp_restore = self.client.post(url_restore)
        self.assertEqual(
            resp_restore.status_code,
            200,
            msg=f"restore status {resp_restore.status_code} / {resp_restore.content!r}",
        )

        # usuario activo otra vez
        student.refresh_from_db()
        self.assertTrue(student.is_active, "student should be active after restore")

    def test_non_admin_cannot_restore(self):
        # primero hacer delete (como admin)
        self.client.force_authenticate(user=self.admin)
        self.client.delete(f"/api/users/{self.student.pk}/")

        # ahora autenticar como teacher (no admin) y tratar de restaurar
        self.client.force_authenticate(user=self.teacher)
        resp = self.client.post(f"/api/users/{self.student.pk}/restore/")
        self.assertIn(
            resp.status_code, (401, 403), msg="non-admin should not be able to restore"
        )
