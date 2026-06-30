import { IndianRupee, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardSummary } from "../hooks/useDashboard";
import { StatCard } from "../components/dashboard/StatCard";
import { MonthlySalesChart } from "../components/dashboard/MonthlySalesChart";
import { StatusBadge } from "../components/ui/StatusBadge";
import { CardSkeleton } from "../components/ui/Skeletons";
import { formatMoney, formatDate } from "../utils/format";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isError) {
    return (
      <div className="rounded-xl border border-danger-light bg-danger-light/40 p-6 text-danger">
        Couldn't load dashboard data. Try refreshing the page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Here's how business is looking today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Revenue"
              value={formatMoney(data.total_revenue)}
              icon={IndianRupee}
              tone="brand"
            />
            <StatCard
              label="Pending Invoices"
              value={String(data.pending_invoices.count)}
              sublabel={formatMoney(data.pending_invoices.amount) + " outstanding"}
              icon={Clock}
              tone="warn"
            />
            <StatCard
              label="Paid Invoices"
              value={String(data.paid_invoices.count)}
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="This Month"
              value={formatMoney(data.monthly_sales.at(-1)?.total ?? 0)}
              icon={TrendingUp}
              tone="ink"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-1 text-sm font-semibold text-ink-900">Sales, last 6 months</h2>
          {isLoading || !data ? (
            <div className="h-64 animate-pulse rounded bg-slate-100" />
          ) : (
            <MonthlySalesChart data={data.monthly_sales} />
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">Recent transactions</h2>
          <div className="space-y-3">
            {isLoading || !data
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-slate-100" />
                ))
              : data.recent_transactions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No invoices yet. Create your first one to see it here.
                  </p>
                ) : (
                  data.recent_transactions.map((inv) => (
                    <Link
                      key={inv.id}
                      to={`/invoices/${inv.id}`}
                      className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-900">{inv.invoice_number}</p>
                        <p className="text-xs text-slate-500">
                          {inv.customer?.name} · {formatDate(inv.issue_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="figures text-sm font-medium text-ink-900">
                          {formatMoney(inv.grand_total)}
                        </p>
                        <StatusBadge status={inv.status} />
                      </div>
                    </Link>
                  ))
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
