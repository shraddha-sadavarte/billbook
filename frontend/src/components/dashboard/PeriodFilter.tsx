import type { DashboardPeriod } from "../../api/dashboard";
import { useTranslation } from "../../context/LanguageContext";

const PERIODS: { key: DashboardPeriod; label: string }[] = [
  { key: "today",   label: "Today" },
  { key: "weekly",  label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly",  label: "Yearly" },
  { key: "all",     label: "All" },
];

interface PeriodFilterProps {
  value: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      {PERIODS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-1.5 text-xs font-semibold transition-colors focus:outline-none ${
            value === key
              ? "bg-brand text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
        >
          {t(label)}
        </button>
      ))}
    </div>
  );
}
