import { useParams } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useInvoice } from "../hooks/useInvoices";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatMoney, formatDate } from "../utils/format";

export function InvoiceDetailPage() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useInvoice(id ? Number(id) : undefined);

  if (isLoading || !invoice) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100" />;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar -- hidden on print */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/invoices" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink-900">
          <ArrowLeft size={16} />
          Back to invoices
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700"
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      {/* Printable invoice card */}
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 sm:p-10 print:rounded-none print:border-0 print:shadow-none">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Invoice {invoice.invoice_number}</h1>
            <div className="mt-2">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
          <div className="text-sm text-slate-500 sm:text-right">
            <p>Issued {formatDate(invoice.issue_date)}</p>
            {invoice.due_date && <p>Due {formatDate(invoice.due_date)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Billed to</p>
            <p className="mt-1 font-medium text-ink-900">{invoice.customer?.name}</p>
            {invoice.customer?.billing_address && (
              <p className="whitespace-pre-line text-sm text-slate-500">{invoice.customer.billing_address}</p>
            )}
            {invoice.customer?.email && <p className="text-sm text-slate-500">{invoice.customer.email}</p>}
            {invoice.customer?.gstin && (
              <p className="text-sm text-slate-500">GSTIN: {invoice.customer.gstin}</p>
            )}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Tax</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2.5 text-ink-700">{item.description}</td>
                <td className="figures py-2.5 text-right text-slate-500">{item.quantity}</td>
                <td className="figures py-2.5 text-right text-slate-500">
                  {formatMoney(item.unit_price)}
                </td>
                <td className="figures py-2.5 text-right text-slate-500">{item.tax_rate}%</td>
                <td className="figures py-2.5 text-right font-medium text-ink-900">
                  {formatMoney(item.line_total ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-4 w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="figures">{formatMoney(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span className="figures">{formatMoney(invoice.tax_total)}</span>
          </div>
          {invoice.discount_total > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Discount</span>
              <span className="figures">-{formatMoney(invoice.discount_total)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-ink-900">
            <span>Total</span>
            <span className="figures">{formatMoney(invoice.grand_total)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Paid</span>
            <span className="figures">{formatMoney(invoice.amount_paid)}</span>
          </div>
          <div className="flex justify-between font-medium text-danger">
            <span>Balance due</span>
            <span className="figures">{formatMoney(invoice.balance_due)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Notes</p>
            <p className="whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
