
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminRole(BasePermission):
    """Only administrators can perform administrative changes."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class CanViewOperations(BasePermission):
    """Admin, Support, and Read-Only can view operational data."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.method in SAFE_METHODS
            and request.user.role in (
                "admin",
                "support",
                "read_only",
            )
        )


class IsAdminOrSupport(BasePermission):
    """Admin and Support can access permitted support operations."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "support")
        )
