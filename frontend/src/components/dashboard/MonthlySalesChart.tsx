import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "../../utils/format";

interface MonthlySalesChartProps {
  data: { month: string; total: number }[];
}

export function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No sales recorded yet — your first invoice will show up here.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#64748B" }}
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) => [formatMoney(value), "Sales"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
        />
        <Area type="monotone" dataKey="total" stroke="#0D9488" strokeWidth={2} fill="url(#salesGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
