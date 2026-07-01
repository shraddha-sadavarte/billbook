import type { InvoiceStatus } from "../../types";
import { useTranslation } from "../../context/LanguageContext";

const STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  pending: "bg-warn-light text-warn",
  paid: "bg-success-light text-success",
  overdue: "bg-danger-light text-danger",
  cancelled: "bg-slate-100 text-slate-400 line-through",
};

const LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {t(LABELS[status])}
    </span>
  );
}
