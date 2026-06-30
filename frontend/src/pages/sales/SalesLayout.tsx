import { Outlet, NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "", label: "Sales List" },
  { to: "add", label: "Add Sale" },
  { to: "pos", label: "POS" },
  { to: "payments", label: "Payments" },
  { to: "returns", label: "Returns" },
];

export function SalesLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Sales</h1>
        <p className="text-sm text-slate-500">Access POS, sales creation, payments, returns and sales list from one module.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ""}
            className={({ isActive }) =>
              `rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
