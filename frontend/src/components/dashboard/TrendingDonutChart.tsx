import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TrendingItem } from "../../types";

interface TrendingDonutChartProps {
  data: TrendingItem[];
  isLoading?: boolean;
}

const COLORS = [
  "#6366F1", // indigo
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#22C55E", // green
  "#F97316", // orange
  "#A855F7", // purple
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg text-xs">
      <p className="font-semibold text-ink-900">{payload[0].name}</p>
      <p className="text-slate-500">
        {payload[0].value} units sold
      </p>
    </div>
  );
};

const renderCustomLegend = (data: TrendingItem[], total: number) => (
  <div className="mt-3 space-y-1.5">
    {data.map((item, idx) => (
      <div key={item.name} className="flex items-center justify-between text-xs border-b border-slate-50 pb-1 last:border-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ background: COLORS[idx % COLORS.length] }}
          />
          <span className="truncate text-slate-700" title={item.name}>{item.name}</span>
        </div>
        <span className="ml-3 font-semibold text-ink-900 flex-shrink-0">
          {total ? Math.round((item.qty / total) * 100) : 0}%
        </span>
      </div>
    ))}
  </div>
);

export function TrendingDonutChart({ data, isLoading }: TrendingDonutChartProps) {
  if (isLoading) {
    return <div className="h-80 animate-pulse rounded bg-slate-100" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-400">
        No sales data yet — create invoices with items.
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.qty, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="qty"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {renderCustomLegend(data, total)}
    </div>
  );
}
