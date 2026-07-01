import { useState, type FormEvent } from "react";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSuppliers, useCreateSupplier, useDeleteSupplier, useUpdateSupplier } from "../../hooks/useSuppliers";
import { TableSkeleton } from "../../components/ui/Skeletons";
import { Modal } from "../../components/ui/Modal";
import { formatMoney } from "../../utils/format";
import type { Supplier } from "../../types";

export function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Australia", "Canada", "United Arab Emirates"];
  const STATE_OPTIONS = ["Maharashtra", "Karnataka", "California", "Texas", "New York", "Queensland"];
  const CITY_OPTIONS = ["Mumbai", "Bengaluru", "Delhi", "New York", "London", "Sydney"];

  const defaultForm = {
    name: "",
    mobile: "",
    email: "",
    phone: "",
    gst_number: "",
    tax_number: "",
    opening_balance: 0,
    country: "",
    state: "",
    city: "",
    postcode: "",
    address: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);

  const { hasPermission, isLoading: authLoading } = useAuth();
  const canCreateSupplier = hasPermission("suppliers.create");
  const canEditSupplier = hasPermission("suppliers.edit");
  const canDeleteSupplier = hasPermission("suppliers.delete");

  const { data, isLoading } = useSuppliers({ page, search });
  const createSupplier = useCreateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    createSupplier.mutate(form, {
      onSuccess: () => {
        setForm(defaultForm);
        setShowForm(false);
      },
    });
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditForm({
      name: supplier.name,
      mobile: supplier.mobile || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      gst_number: supplier.gst_number || "",
      tax_number: supplier.tax_number || "",
      opening_balance: supplier.opening_balance || 0,
      country: supplier.country || "",
      state: supplier.state || "",
      city: supplier.city || "",
      postcode: supplier.postcode || "",
      address: supplier.address || "",
    });
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    updateSupplier.mutate(
      { id: editingSupplier.id, payload: editForm },
      {
        onSuccess: () => {
          setEditingSupplier(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this supplier?")) {
      deleteSupplier.mutate(id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Suppliers</h1>
          <p className="text-sm text-slate-500">Manage supplier contacts, opening balances and address details.</p>
          <p className="text-sm text-slate-400">{data?.total ?? 0} total suppliers</p>
        </div>
        {canCreateSupplier ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark shadow-sm"
          >
            <Plus size={16} />
            Add Supplier
          </button>
        ) : authLoading ? (
          <div className="h-10 w-28" />
        ) : (
          <p className="text-sm text-slate-500">You don't have permission to add suppliers.</p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Supplier Name</label>
            <input
              required
              placeholder="e.g. Acme Suppliers"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile</label>
            <input
              placeholder="e.g. +91 98765 43210"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
            <input
              type="email"
              placeholder="e.g. supplier@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
            <input
              placeholder="e.g. 022 1234 5678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST Number</label>
            <input
              placeholder="e.g. 27AAAAA1111A1Z1"
              value={form.gst_number}
              onChange={(e) => setForm({ ...form, gst_number: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Number</label>
            <input
              placeholder="e.g. 123456789"
              value={form.tax_number}
              onChange={(e) => setForm({ ...form, tax_number: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Opening Balance</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.opening_balance || ""}
              onChange={(e) => setForm({ ...form, opening_balance: Number(e.target.value) || 0 })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Country</label>
            <input
              list="country-options"
              placeholder="Start typing or choose a country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">State</label>
            <input
              list="state-options"
              placeholder="Start typing or choose a state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">City</label>
            <input
              list="city-options"
              placeholder="Start typing or choose a city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Postcode</label>
            <input
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand h-24 resize-none"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSupplier.isPending}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {createSupplier.isPending ? "Saving…" : "Save Supplier"}
            </button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search suppliers by name…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">GST / Tax</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={6} cols={5} />
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No suppliers found matching your search.
                </td>
              </tr>
            ) : (
              data.items.map((supplier) => (
                <tr key={supplier.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink-900">{supplier.name}</p>
                    {supplier.address && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{supplier.address}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <p>{supplier.email || "—"}</p>
                    {(supplier.mobile || supplier.phone) && (
                      <p className="text-xs text-slate-400 mt-0.5">{supplier.mobile || supplier.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {supplier.gst_number || "—"}
                    {supplier.tax_number ? <span className="block text-slate-400">{supplier.tax_number}</span> : null}
                  </td>
                  <td className="figures px-4 py-3 text-right font-medium text-ink-900">{formatMoney(supplier.opening_balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {canEditSupplier && (
                        <button
                          onClick={() => handleEditClick(supplier)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink-900 transition-colors"
                          aria-label="Edit supplier"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {canDeleteSupplier && (
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-danger-light hover:text-danger transition-colors"
                          aria-label="Delete supplier"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {data.page} of {data.pages}
          </span>
          <button
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <Modal
        isOpen={editingSupplier !== null}
        onClose={() => setEditingSupplier(null)}
        title="Edit Supplier"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Supplier Name</label>
            <input
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile</label>
            <input
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
            <input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GST Number</label>
            <input
              value={editForm.gst_number}
              onChange={(e) => setEditForm({ ...editForm, gst_number: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tax Number</label>
            <input
              value={editForm.tax_number}
              onChange={(e) => setEditForm({ ...editForm, tax_number: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Opening Balance</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={editForm.opening_balance || ""}
              onChange={(e) => setEditForm({ ...editForm, opening_balance: Number(e.target.value) || 0 })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Country</label>
            <input
              list="country-options"
              placeholder="Start typing or choose a country"
              value={editForm.country}
              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">State</label>
            <input
              list="state-options"
              placeholder="Start typing or choose a state"
              value={editForm.state}
              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">City</label>
            <input
              list="city-options"
              placeholder="Start typing or choose a city"
              value={editForm.city}
              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Postcode</label>
            <input
              value={editForm.postcode}
              onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
            <textarea
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand h-24 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingSupplier(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateSupplier.isPending}
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {updateSupplier.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
