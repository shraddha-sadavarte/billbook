import { useState, type FormEvent } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useCustomers, useCreateCustomer, useDeleteCustomer } from "../hooks/useCustomers";
import { TableSkeleton } from "../components/ui/Skeletons";
import { formatMoney } from "../utils/format";

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const { data, isLoading } = useCustomers({ search });
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createCustomer.mutate(form, {
      onSuccess: () => {
        setForm({ name: "", email: "", phone: "" });
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Customers</h1>
          <p className="text-sm text-slate-500">{data?.total ?? 0} total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3"
        >
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={createCustomer.isPending}
            className="sm:col-span-3 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50"
          >
            {createCustomer.isPending ? "Saving…" : "Save customer"}
          </button>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                  No customers yet.
                </td>
              </tr>
            ) : (
              data?.items.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-ink-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.email || c.phone || "—"}</td>
                  <td className="figures px-4 py-3 text-right text-ink-900">{formatMoney(c.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteCustomer.mutate(c.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-danger-light hover:text-danger"
                      aria-label="Delete customer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
