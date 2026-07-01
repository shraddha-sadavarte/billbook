import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "../../components/ui/Modal";
import type { AdvancePayment, Customer, PaymentType, AdvancePaymentStatus } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: AdvancePayment | null;
  customers: Customer[];
  isSubmitting?: boolean;
}

export function AdvancePaymentForm({ isOpen, onClose, onSubmit, initialData, customers, isSubmitting }: Props) {
  const [form, setForm] = useState<{
    customer_id: string;
    amount: string;
    payment_date: string;
    payment_type: PaymentType;
    reference: string;
    notes: string;
    status: AdvancePaymentStatus;
  }>({
    customer_id: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_type: "cash",
    reference: "",
    notes: "",
    status: "pending",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        customer_id: String(initialData.customer_id),
        amount: String(initialData.amount),
        payment_date: initialData.payment_date || new Date().toISOString().slice(0, 10),
        payment_type: initialData.payment_type as PaymentType,
        reference: initialData.reference || "",
        notes: initialData.notes || "",
        status: initialData.status as AdvancePaymentStatus,
      });
    } else {
      setForm({
        customer_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_type: "cash",
        reference: "",
        notes: "",
        status: "pending",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      customer_id: Number(form.customer_id),
      amount: Number(form.amount),
      payment_date: form.payment_date || null,
      payment_type: form.payment_type,
      reference: form.reference || null,
      notes: form.notes || null,
      status: form.status,
    };
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Advance Payment" : "New Advance Payment"} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Customer</label>
          <select
            required
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Amount (₹)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Payment Date</label>
          <input
            type="date"
            required
            value={form.payment_date}
            onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Payment Type</label>
          <select
            required
            value={form.payment_type}
            onChange={(e) => setForm({ ...form, payment_type: e.target.value as PaymentType })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Reference (optional)</label>
          <input
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="Cheque no., transaction ID, etc."
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AdvancePaymentStatus })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Notes (optional)</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            {isSubmitting ? "Saving…" : initialData ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}