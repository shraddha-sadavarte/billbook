# BillBook — Multi-Tenant SaaS Billing Platform

A working vertical slice: multi-tenant auth + RBAC, customer & product CRUD,
an invoice engine with server-authoritative tax/discount calculation, and a
dashboard with live charts. Backend is Flask + MySQL, frontend is React +
TypeScript + TanStack Query.

This is a **real, runnable foundation**, not a mockup — every route below has
been exercised end-to-end (tenant isolation, invoice math, dashboard
aggregation) during development. It is intentionally scoped to the core flow;
see "What's not built yet" for what to extend next.

## Architecture at a glance

```
billbook/
├── backend/                 Flask API (MySQL via SQLAlchemy)
│   ├── app/
│   │   ├── models/          Tenant, User, Customer, Product, Invoice, InvoiceItem
│   │   ├── routes/          auth, customers, products, invoices, dashboard
│   │   ├── schemas/         Marshmallow validation
│   │   ├── tenant_scope.py  auto-filters every query by tenant_id
│   │   └── utils/           @require_auth / @require_role decorators
│   ├── config.py
│   ├── run.py
│   └── seed.py               creates a demo login in one command
└── frontend/                 React + TS + Vite
    └── src/
        ├── api/               axios functions, one file per resource
        ├── hooks/              TanStack Query hooks wrapping the api/ functions
        ├── components/         InvoiceItemsEditor, InvoiceTotals, StatCard, etc.
        ├── pages/               Dashboard, Invoices, Customers, Products, Auth
        ├── layouts/             collapsible sidebar shell
        └── context/AuthContext.tsx
```

## How multi-tenancy actually works

Every tenant-owned table has a `tenant_id` column (see `TenantScopedMixin` in
`tenant_scope.py`). Rather than trusting each route to remember
`.filter_by(tenant_id=...)`, a SQLAlchemy `do_orm_execute` event hook
auto-injects that filter into every SELECT/UPDATE/DELETE for any model that
inherits the mixin. The tenant_id comes from the JWT claims, set into Flask's
`g` object by the `@require_auth` decorator at the top of each request.

This means a developer forgetting to scope a new query doesn't leak data —
the only way to bypass it is `.execution_options(skip_tenant_scope=True)`,
which should be rare and reviewed.

## Setup

### 1. Database

Create a MySQL database and user:

```sql
CREATE DATABASE billbook CHARACTER SET utf8mb4;
CREATE USER 'billbook'@'localhost' IDENTIFIED BY 'billbook';
GRANT ALL PRIVILEGES ON billbook.* TO 'billbook'@'localhost';
```

### 2. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit DB credentials if needed

flask db init                 # first time only
flask db migrate -m "initial schema"
flask db upgrade

python seed.py                # optional: creates a demo login
python run.py                 # runs on http://localhost:5000
```

Demo login after seeding: `admin@demo.com` / `password123`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # points at http://localhost:5000/api/v1 by default
npm run dev                   # runs on http://localhost:5173
```

## What's implemented

- Tenant signup (creates Tenant + Tenant Admin in one transaction)
- JWT login/refresh, RBAC via `@require_role("tenant_admin", ...)`
- Tenant-isolated CRUD: customers, products
- Invoice engine: multi-line items, per-line tax rate, invoice-level flat or
  percent discount, server-side recalculation (never trusts client totals)
- Payment recording, automatic status transition to "paid"
- Dashboard: total revenue, pending/paid counts, 6-month sales trend, recent
  transactions
- Print-friendly invoice view (`window.print()` — browser's "Save as PDF"
  covers the PDF export requirement without an extra dependency)
- Fully responsive layout, collapsible sidebar, skeleton loading states,
  toast notifications

## What's not built yet (next steps)

- Super Admin cross-tenant console (model/role exists; no UI/routes yet)
- Recurring invoices, email delivery, payment gateway integration
- Inventory stock deduction on invoice creation
- Audit logging, soft-delete on invoices, rate limiting
- Automated test suite (the logic above was verified manually during
  development — see the commit history of this conversation for the actual
  test runs against tenant isolation and invoice math)

## A note on the invoice numbering scheme

`_generate_invoice_number()` in `routes/invoices.py` uses a simple
count-based sequence (`INV-0001`, `INV-0002`, ...). Under concurrent writes
this has a race condition — two clerks creating invoices at the same instant
could collide. For production, replace this with a `SELECT ... FOR UPDATE`
on a per-tenant counter row, or a database sequence.
