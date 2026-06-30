import { useState, type FormEvent } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useProducts, useCreateProduct, useDeleteProduct } from "../hooks/useProducts";
import { TableSkeleton } from "../components/ui/Skeletons";
import { formatMoney } from "../utils/format";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", unit_price: 0, tax_rate: 0, stock_quantity: 0, unit: "pcs" });

  const { data, isLoading } = useProducts({ search });
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createProduct.mutate(form, {
      onSuccess: () => {
        setForm({ name: "", unit_price: 0, tax_rate: 0, stock_quantity: 0, unit: "pcs" });
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Products</h1>
          <p className="text-sm text-slate-500">{data?.total ?? 0} total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4"
        >
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand sm:col-span-2"
          />
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Unit price"
            value={form.unit_price || ""}
            onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) || 0 })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            placeholder="Tax %"
            value={form.tax_rate || ""}
            onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) || 0 })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            type="number"
            min={0}
            placeholder="Stock qty"
            value={form.stock_quantity || ""}
            onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) || 0 })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <input
            placeholder="Unit (pcs, kg, hr…)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-50 sm:col-span-4"
          >
            {createProduct.isPending ? "Saving…" : "Save product"}
          </button>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Unit Price</th>
              <th className="px-4 py-3 text-right">Tax</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No products yet.
                </td>
              </tr>
            ) : (
              data?.items.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-ink-900">{p.name}</td>
                  <td className="figures px-4 py-3 text-right text-ink-900">{formatMoney(p.unit_price)}</td>
                  <td className="figures px-4 py-3 text-right text-slate-500">{p.tax_rate}%</td>
                  <td className="figures px-4 py-3 text-right text-slate-500">
                    {p.stock_quantity} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteProduct.mutate(p.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-danger-light hover:text-danger"
                      aria-label="Delete product"
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
