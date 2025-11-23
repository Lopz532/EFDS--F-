from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            # blacklisting the provided refresh token
            token = OutstandingToken.objects.get(token=refresh_token)
            BlacklistedToken.objects.get_or_create(token=token)
            return Response({"detail": "token blacklisted"}, status=status.HTTP_200_OK)
        except OutstandingToken.DoesNotExist:
            return Response(
                {"detail": "token not found"}, status=status.HTTP_400_BAD_REQUEST
            )
