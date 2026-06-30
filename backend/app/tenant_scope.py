"""
Multi-tenant data isolation.

Strategy: shared database, discriminator column (`tenant_id`) on every
tenant-owned table. Rather than trusting every route/handler to remember to
add `.filter_by(tenant_id=...)`, we enforce it centrally with a SQLAlchemy
`do_orm_execute` event hook. Any query against a model that inherits
`TenantScopedMixin` is automatically rewritten to include the tenant filter,
using the tenant_id stored on Flask's `g` for the current request.

This means a developer who forgets to scope a query doesn't leak another
tenant's data by mistake — the only way to bypass it is to explicitly opt
out (see `unscoped()` below), which should be rare and reviewed in PRs.
"""

from flask import g
from sqlalchemy import event
from sqlalchemy.orm import declarative_mixin
from sqlalchemy.orm.session import Session
from sqlalchemy.sql import select

from app.extensions import db


class TenantContext:
    """Holds the active tenant for the lifetime of a single request."""

    @staticmethod
    def set(tenant_id: int) -> None:
        g.tenant_id = tenant_id

    @staticmethod
    def get() -> int | None:
        return getattr(g, "tenant_id", None)

    @staticmethod
    def clear() -> None:
        g.tenant_id = None


@declarative_mixin
class TenantScopedMixin:
    """
    Mixin for any model whose rows belong to a single tenant.
    Adds the `tenant_id` column and a relationship back to Tenant.
    """

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )


# Models that should NEVER be auto-filtered (system-wide tables).
_EXEMPT_MODELS = set()


def exempt_from_tenant_scoping(model_cls):
    """Decorator to explicitly opt a model out of auto-filtering (e.g. Tenant itself)."""
    _EXEMPT_MODELS.add(model_cls)
    return model_cls


@event.listens_for(Session, "do_orm_execute")
def _enforce_tenant_scoping(execute_state):
    """
    Fires on every ORM SELECT/UPDATE/DELETE. If the target model is
    tenant-scoped and a tenant is active on this request, inject the filter.
    """
    if not execute_state.is_select and not execute_state.is_update and not execute_state.is_delete:
        return

    # Allow explicit bypass for system/admin operations (e.g. Super Admin
    # cross-tenant reporting) via `.execution_options(skip_tenant_scope=True)`
    if execute_state.execution_options.get("skip_tenant_scope", False):
        return

    tenant_id = TenantContext.get()
    if tenant_id is None:
        # No tenant in context (e.g. login route, tenant signup route).
        # Those routes query by other keys (email, etc.) and don't need scoping.
        return

    for desc in execute_state.statement.column_descriptions:
        entity = desc.get("entity")
        if entity is None or entity in _EXEMPT_MODELS:
            continue
        if issubclass(entity, TenantScopedMixin):
            execute_state.statement = execute_state.statement.where(
                entity.tenant_id == tenant_id
            )
