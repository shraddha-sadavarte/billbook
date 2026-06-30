import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Menu,
  X,
  LogOut,
  Receipt,
  ShieldCheck,
  ChevronRight,
  Bell,
  Globe,
  Monitor,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
  { to: "/sales",     label: "Sales",     icon: Receipt,          permission: "invoices.view" },
  { to: "/pos",       label: "POS",        icon: Monitor,         permission: "invoices.view" },
  { to: "/customers", label: "Customers", icon: Users,            permission: "customers.view" },
  { to: "/products",  label: "Products",  icon: Package,          permission: "products.view" },
  { to: "/users",     label: "Users",     icon: Users,            permission: "users.view" },
  { to: "/roles",     label: "Roles",     icon: ShieldCheck,      permission: "roles.view" },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  // User initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Receipt size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">BillBook</span>
          </div>
          <button
            className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
          <div className="flex flex-col gap-0.5">
            {visibleNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand/20 text-brand-light border-l-2 border-brand"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className={isActive ? "text-brand-light" : "text-slate-500 group-hover:text-slate-300"} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight size={14} className="text-brand-light" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-ink-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop: empty left side */}
          <div className="hidden lg:block" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language pill */}
            <button className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors sm:flex">
              <Globe size={13} />
              English
            </button>

            {/* POS pill */}
            <button className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors sm:flex">
              <Monitor size={13} />
              POS
            </button>

            {/* Notifications */}
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-ink-900 transition-colors">
              <Bell size={18} />
            </button>

            {/* Role badge */}
            <span className="hidden rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark sm:inline">
              {user?.is_super_admin ? "Super Admin" : user?.role_name ?? "User"}
            </span>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
