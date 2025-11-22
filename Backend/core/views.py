from django.http import JsonResponse
from django.views.decorators.http import require_GET

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import RegisterSerializer, UserSerializer

@require_GET
@extend_schema(
    responses=OpenApiResponse(response=UserSerializer, description="Health check response")
)
def ping(request):
    return JsonResponse({"pong": True, "message": "Core app OK"})


# Usamos Generic CreateAPIView para que drf-spectacular infiera el serializer sin advertencias.
@extend_schema(
    request=RegisterSerializer,
    responses={201: UserSerializer, 400: OpenApiResponse(description="Bad request")}
)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)


@extend_schema(
    responses=OpenApiResponse(response=UserSerializer, description="Authenticated user info")
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"ok": True, "user": request.user.username})

# -------------------------
# Endpoint para /api/auth/me/
# -------------------------
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Devuelve los datos del usuario autenticado.
    GET /api/auth/me/
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
