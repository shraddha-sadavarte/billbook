import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: "brand" | "warn" | "success" | "ink";
}

const TONE_STYLES: Record<string, string> = {
  brand: "bg-brand-light text-brand-dark",
  warn: "bg-warn-light text-warn",
  success: "bg-success-light text-success",
  ink: "bg-slate-100 text-ink-700",
};

export function StatCard({ label, value, sublabel, icon: Icon, tone = "ink" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="figures mt-1.5 text-2xl font-semibold text-ink-900">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONE_STYLES[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
