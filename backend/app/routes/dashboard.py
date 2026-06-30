from datetime import date, timedelta

from flask import Blueprint, jsonify
from sqlalchemy import func

from app.extensions import db
from app.models import Invoice, InvoiceStatus
from app.utils.decorators import require_auth

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/v1/dashboard")


@dashboard_bp.route("/summary", methods=["GET"])
@require_auth
def summary():
    total_revenue = db.session.query(func.coalesce(func.sum(Invoice.amount_paid), 0)).scalar()

    pending_count = Invoice.query.filter(
        Invoice.status.in_([InvoiceStatus.PENDING, InvoiceStatus.OVERDUE])
    ).count()
    pending_amount = (
        db.session.query(func.coalesce(func.sum(Invoice.grand_total - Invoice.amount_paid), 0))
        .filter(Invoice.status.in_([InvoiceStatus.PENDING, InvoiceStatus.OVERDUE]))
        .scalar()
    )

    paid_count = Invoice.query.filter(Invoice.status == InvoiceStatus.PAID).count()

    # Monthly sales for the trailing 6 months, grouped by calendar month.
    six_months_ago = date.today().replace(day=1) - timedelta(days=180)
    monthly_rows = (
        db.session.query(
            func.date_format(Invoice.issue_date, "%Y-%m").label("month"),
            func.coalesce(func.sum(Invoice.grand_total), 0).label("total"),
        )
        .filter(Invoice.issue_date >= six_months_ago)
        .group_by("month")
        .order_by("month")
        .all()
    )
    monthly_sales = [{"month": row.month, "total": float(row.total)} for row in monthly_rows]

    recent = (
        Invoice.query.order_by(Invoice.created_at.desc())
        .limit(8)
        .all()
    )

    return jsonify(
        {
            "total_revenue": float(total_revenue or 0),
            "pending_invoices": {"count": pending_count, "amount": float(pending_amount or 0)},
            "paid_invoices": {"count": paid_count},
            "monthly_sales": monthly_sales,
            "recent_transactions": [inv.to_dict(include_items=False) for inv in recent],
        }
    )
