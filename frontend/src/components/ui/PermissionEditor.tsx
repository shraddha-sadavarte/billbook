import type { PermissionCatalog } from "../../types";

interface PermissionEditorProps {
  catalog: PermissionCatalog["catalog"];
  selected: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

const MODULE_LABELS: Record<string, string> = {
  users: "Users",
  roles: "Roles",
  customers: "Customers",
  suppliers: "Suppliers",
  products: "Products",
  invoices: "Invoices",
  dashboard: "Dashboard",
  reports: "Reports",
  settings: "Settings",
};

export function PermissionEditor({ catalog, selected, onChange, disabled }: PermissionEditorProps) {
  const toggle = (key: string) => {
    if (disabled) return;
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  };

  const toggleAllForModule = (moduleKey: string, actions: string[]) => {
    if (disabled) return;
    const moduleKeys = actions.map((a) => `${moduleKey}.${a}`);
    const allSelected = moduleKeys.every((k) => selected.includes(k));
    if (allSelected) {
      onChange(selected.filter((k) => !moduleKeys.includes(k)));
    } else {
      onChange([...new Set([...selected, ...moduleKeys])]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Object.entries(catalog).map(([moduleKey, actions]) => {
        const moduleKeys = actions.map((a) => `${moduleKey}.${a}`);
        const allSelected = moduleKeys.every((k) => selected.includes(k));
        return (
          <div key={moduleKey} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink-900">
                {MODULE_LABELS[moduleKey] ?? moduleKey}
              </span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleAllForModule(moduleKey, actions)}
                className="text-xs font-medium text-brand hover:underline disabled:opacity-40"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {actions.map((action) => {
                const key = `${moduleKey}.${action}`;
                return (
                  <label key={key} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={selected.includes(key)}
                      disabled={disabled}
                      onChange={() => toggle(key)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    {action.replace("_", " ")}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
