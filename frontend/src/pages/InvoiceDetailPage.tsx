import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, CreditCard, ChevronDown, Trash2, Calendar, FileText } from "lucide-react";
import { useInvoice, useUpdateInvoice, useDeleteInvoice, useRecordPayment } from "../hooks/useInvoices";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Modal } from "../components/ui/Modal";
import { formatMoney, formatDate } from "../utils/format";
import type { InvoiceStatus } from "../types";

export function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceId = id ? Number(id) : undefined;

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const recordPayment = useRecordPayment();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (isLoading || !invoice) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100" />;
  }

  const handleStatusChange = (status: InvoiceStatus) => {
    if (!invoiceId) return;
    updateInvoice.mutate(
      { id: invoiceId, payload: { status } },
      {
        onSuccess: () => {
          setShowStatusDropdown(false);
        },
      }
    );
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId || !paymentAmount) return;
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;
    recordPayment.mutate(
      { id: invoiceId, amount: amt },
      {
        onSuccess: () => {
          setIsPaymentOpen(false);
          setPaymentAmount("");
        },
      }
    );
  };

  const handleDeleteInvoice = () => {
    if (!invoiceId) return;
    if (confirm("Are you sure you want to permanently delete this invoice? This action cannot be undone.")) {
      deleteInvoice.mutate(invoiceId, {
        onSuccess: () => {
          navigate("/invoices");
        },
      });
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* ── Toolbar (hidden on print) ────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to="/invoices" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink-900 transition-colors">
          <ArrowLeft size={16} />
          Back to invoices
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Change Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <span>Change Status</span>
              <ChevronDown size={14} />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-lg border border-slate-100 bg-white p-1 shadow-lg z-20">
                {(["draft", "pending", "paid", "overdue", "cancelled"] as InvoiceStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className="w-full rounded-md px-3 py-1.5 text-left text-xs font-semibold capitalize text-slate-700 hover:bg-slate-50 hover:text-ink-900"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Record Payment Button */}
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark shadow-sm"
            >
              <CreditCard size={15} />
              Record Payment
            </button>
          )}

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Printer size={15} />
            Print Invoice
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteInvoice}
            className="flex items-center gap-1.5 rounded-lg border border-danger-light bg-danger-light/50 px-3 py-2 text-sm font-semibold text-danger hover:bg-danger-light transition-colors shadow-sm"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      {/* ── Printable Invoice Card ───────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm print:rounded-none print:border-0 print:shadow-none print:p-0">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-brand">
                <FileText size={15} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-ink-900">BillBook Invoice</span>
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight pt-1">
              Invoice #{invoice.invoice_number}
            </h1>
            <div className="pt-1">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
          <div className="text-sm text-slate-500 sm:text-right space-y-1">
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Calendar size={13} className="text-slate-400" />
              <span>Issued: {formatDate(invoice.issue_date)}</span>
            </div>
            {invoice.due_date && (
              <p className="font-medium text-amber-600">Due: {formatDate(invoice.due_date)}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Billed To</p>
            <p className="mt-1.5 text-base font-bold text-ink-900">{invoice.customer?.name}</p>
            {invoice.customer?.billing_address && (
              <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-xs">{invoice.customer.billing_address}</p>
            )}
            <div className="mt-2 text-xs text-slate-400 space-y-0.5">
              {invoice.customer?.email && <p>Email: {invoice.customer.email}</p>}
              {invoice.customer?.phone && <p>Phone: {invoice.customer.phone}</p>}
              {invoice.customer?.gstin && <p className="font-mono text-ink-700">GSTIN: {invoice.customer.gstin}</p>}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Tax Rate</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-medium text-ink-700">{item.description}</td>
                  <td className="figures py-3 px-3 text-right text-slate-500">{item.quantity}</td>
                  <td className="figures py-3 px-3 text-right text-slate-500">
                    {formatMoney(item.unit_price)}
                  </td>
                  <td className="figures py-3 px-3 text-right text-slate-400">{item.tax_rate}%</td>
                  <td className="figures py-3 px-3 text-right font-semibold text-ink-900">
                    {formatMoney(item.line_total ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="ml-auto mt-4 w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="figures font-medium">{formatMoney(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span className="figures font-medium">{formatMoney(invoice.tax_total)}</span>
          </div>
          {invoice.discount_total > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount</span>
              <span className="figures">-{formatMoney(invoice.discount_total)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-ink-900">
            <span>Total</span>
            <span className="figures text-lg">{formatMoney(invoice.grand_total)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Amount Paid</span>
            <span className="figures font-medium">{formatMoney(invoice.amount_paid)}</span>
          </div>
          <div className="flex justify-between pt-1 font-bold text-danger">
            <span>Balance Due</span>
            <span className="figures">{formatMoney(invoice.balance_due)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Notes / Comments</p>
            <p className="whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* ── Record Payment Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Record Payment"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-2">
              Enter the amount collected from the customer. The balance due is{" "}
              <strong className="text-ink-900 font-bold">{formatMoney(invoice.balance_due)}</strong>.
            </p>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Payment Amount (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="e.g. 500.00"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPaymentOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recordPayment.isPending}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {recordPayment.isPending ? "Recording…" : "Record Payment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
