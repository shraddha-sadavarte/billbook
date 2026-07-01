import { Trash2, Plus } from "lucide-react";
import type { InvoiceItem } from "../../types";
import { formatMoney } from "../../utils/format";
import { useTranslation } from "../../context/LanguageContext";

interface InvoiceItemsEditorProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

function lineTotal(item: InvoiceItem) {
  const subtotal = item.quantity * item.unit_price;
  const tax = subtotal * (item.tax_rate / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export function InvoiceItemsEditor({ items, onChange }: InvoiceItemsEditorProps) {
  const { t } = useTranslation();

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  };

  const addItem = () => {
    onChange([...items, { description: "", quantity: 1, unit_price: 0, tax_rate: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">{t("Description")}</th>
            <th className="w-20 px-3 py-3">{t("Qty")}</th>
            <th className="w-28 px-3 py-3">{t("Unit Price")}</th>
            <th className="w-20 px-3 py-3">{t("Tax %")}</th>
            <th className="w-32 px-4 py-3 text-right">{t("Amount")}</th>
            <th className="w-10 px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const { total } = lineTotal(item);
            return (
              <tr key={index} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder={t("Item or service name")}
                    className="w-full rounded-md border-0 bg-transparent px-1 py-1.5 text-sm focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: Number(e.target.value) || 0 })}
                    className="figures w-full rounded-md border-0 bg-transparent px-1 py-1.5 text-sm focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, { unit_price: Number(e.target.value) || 0 })}
                    className="figures w-full rounded-md border-0 bg-transparent px-1 py-1.5 text-sm focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={item.tax_rate}
                    onChange={(e) => updateItem(index, { tax_rate: Number(e.target.value) || 0 })}
                    className="figures w-full rounded-md border-0 bg-transparent px-1 py-1.5 text-sm focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </td>
                <td className="figures px-4 py-2 text-right font-medium text-ink-900">
                  {formatMoney(total)}
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-danger-light hover:text-danger"
                    aria-label={t("Remove line item")}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1.5 border-t border-slate-200 px-4 py-3 text-sm font-medium text-brand hover:bg-brand-light/40"
      >
        <Plus size={16} />
        {t("Add line item")}
      </button>
    </div>
  );
}