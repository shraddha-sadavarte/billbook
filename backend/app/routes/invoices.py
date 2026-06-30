from datetime import date

from flask import Blueprint, request, jsonify, g
from marshmallow import ValidationError

from app.extensions import db
from app.models import Invoice, InvoiceItem, InvoiceStatus
from app.schemas import InvoiceSchema
from app.tenant_scope import TenantContext
from app.utils.decorators import require_auth

invoices_bp = Blueprint("invoices", __name__, url_prefix="/api/v1/invoices")


def _generate_invoice_number() -> str:
    """
    Simple per-tenant sequential numbering: INV-0001, INV-0002, ...
    Counts existing invoices for the tenant (auto-scoped by tenant_scope.py).
    For high-concurrency production use, back this with a DB sequence/lock
    instead of a count-based approach to avoid race conditions.
    """
    count = Invoice.query.count()
    return f"INV-{count + 1:04d}"


@invoices_bp.route("", methods=["GET"])
@require_auth
def list_invoices():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    status = request.args.get("status")
    search = request.args.get("search", "").strip()

    query = Invoice.query
    if status:
        query = query.filter(Invoice.status == status)
    if search:
        query = query.join(Invoice.customer).filter(
            db.or_(
                Invoice.invoice_number.ilike(f"%{search}%"),
            )
        )

    pagination = query.order_by(Invoice.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify(
        {
            "items": [inv.to_dict(include_items=False) for inv in pagination.items],
            "total": pagination.total,
            "page": page,
            "pages": pagination.pages,
        }
    )


@invoices_bp.route("/<int:invoice_id>", methods=["GET"])
@require_auth
def get_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    return jsonify(invoice.to_dict())


@invoices_bp.route("", methods=["POST"])
@require_auth
def create_invoice():
    """
    Staff/Billing Clerks and Tenant Admins can both create invoices.
    Totals are NEVER trusted from the client — recalculate_totals() is the
    single source of truth, run here right before commit.
    """
    try:
        data = InvoiceSchema().load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 422

    items_data = data.pop("items")

    invoice = Invoice(
        tenant_id=TenantContext.get(),
        invoice_number=_generate_invoice_number(),
        customer_id=data["customer_id"],
        issue_date=data.get("issue_date") or date.today(),
        due_date=data.get("due_date"),
        discount_type=data.get("discount_type", "flat"),
        discount_value=data.get("discount_value", 0),
        notes=data.get("notes"),
        status=InvoiceStatus(data.get("status", "draft")),
    )

    for item_data in items_data:
        invoice.items.append(
            InvoiceItem(
                product_id=item_data.get("product_id"),
                description=item_data["description"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                tax_rate=item_data.get("tax_rate", 0),
            )
        )

    invoice.recalculate_totals()
    db.session.add(invoice)
    db.session.commit()
    return jsonify(invoice.to_dict()), 201


@invoices_bp.route("/<int:invoice_id>", methods=["PUT"])
@require_auth
def update_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    try:
        data = InvoiceSchema(partial=True).load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 422

    items_data = data.pop("items", None)

    for key in ("customer_id", "issue_date", "due_date", "discount_type", "discount_value", "notes"):
        if key in data:
            setattr(invoice, key, data[key])
    if "status" in data:
        invoice.status = InvoiceStatus(data["status"])

    if items_data is not None:
        invoice.items.clear()
        for item_data in items_data:
            invoice.items.append(
                InvoiceItem(
                    product_id=item_data.get("product_id"),
                    description=item_data["description"],
                    quantity=item_data["quantity"],
                    unit_price=item_data["unit_price"],
                    tax_rate=item_data.get("tax_rate", 0),
                )
            )

    invoice.recalculate_totals()
    db.session.commit()
    return jsonify(invoice.to_dict())


@invoices_bp.route("/<int:invoice_id>", methods=["DELETE"])
@require_auth
def delete_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    db.session.delete(invoice)
    db.session.commit()
    return "", 204


@invoices_bp.route("/<int:invoice_id>/record-payment", methods=["POST"])
@require_auth
def record_payment(invoice_id):
    """Records a (partial or full) payment against an invoice and updates status."""
    invoice = Invoice.query.get_or_404(invoice_id)
    payload = request.get_json(force=True) or {}
    amount = payload.get("amount")

    if amount is None or float(amount) <= 0:
        return jsonify({"error": "amount must be a positive number"}), 422

    invoice.amount_paid = float(invoice.amount_paid or 0) + float(amount)
    if invoice.amount_paid >= float(invoice.grand_total or 0):
        invoice.status = InvoiceStatus.PAID
    else:
        invoice.status = InvoiceStatus.PENDING

    db.session.commit()
    return jsonify(invoice.to_dict())
