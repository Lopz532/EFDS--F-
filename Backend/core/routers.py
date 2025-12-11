from rest_framework.routers import DefaultRouter
from .viewsets import MateriaViewSet, TareaViewSet, ClassroomViewSet, SubmissionViewSet
from .viewsets_users import UserViewSet
from .viewsets_audit import DeletionLogViewSet

router = DefaultRouter()
router.register(r"materias", MateriaViewSet, basename="materia")
router.register(r"tareas", TareaViewSet, basename="tarea")
router.register(r"classrooms", ClassroomViewSet, basename="classroom")
router.register(r"submissions", SubmissionViewSet, basename="submission")
router.register(r"users", UserViewSet, basename="user")
router.register(r"deletion-logs", DeletionLogViewSet, basename="deletionlog")
