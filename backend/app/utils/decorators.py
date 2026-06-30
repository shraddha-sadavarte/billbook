"""
Auth + RBAC decorators.

`@require_auth` verifies the JWT, loads the user, and — critically — sets
the TenantContext for the request so every downstream query is
auto-scoped by app/tenant_scope.py. This is the single place tenant_id
enters the request lifecycle; nothing else should set it.

`@require_permission(...)` stacks on top to restrict by granular
permission key (e.g. "users.delete"), checked against the requesting
user's assigned Role. Super Admins pass every check automatically.
"""

from functools import wraps

from flask import jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt

from app.tenant_scope import TenantContext


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        user_id = get_jwt_identity()

        # tenant_id travels inside the JWT claims (set at login time) so we
        # don't need an extra DB round-trip just to discover which tenant
        # this request belongs to.
        tenant_id = claims.get("tenant_id")
        TenantContext.set(tenant_id)

        g.current_user_id = int(user_id) if user_id is not None else None
        g.current_user_is_super_admin = claims.get("is_super_admin", False)
        g.current_user_permissions = set(claims.get("permissions", []))
        return fn(*args, **kwargs)

    return wrapper


def require_permission(permission_key: str):
    """
    Usage: @require_permission("users.delete")
    Must be stacked UNDER @require_auth (auth runs first).
    Permission set is read from JWT claims (set at login), so this check
    never needs a DB round-trip.
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if getattr(g, "current_user_is_super_admin", False):
                return fn(*args, **kwargs)
            permissions = getattr(g, "current_user_permissions", set())
            if permission_key not in permissions:
                return jsonify({"error": f"Forbidden: missing permission '{permission_key}'"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def current_user():
    from app.models import User

    user_id = getattr(g, "current_user_id", None)
    if user_id is None:
        return None
    return User.query.get(user_id)
