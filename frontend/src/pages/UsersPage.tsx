import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";
import { Modal } from "../components/ui/Modal";
import { TableSkeleton } from "../components/ui/Skeletons";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import { useTranslation } from "../context/LanguageContext";

export function UsersPage() {
  const { t } = useTranslation();
  const { user: currentUser, hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });

  const { data, isLoading } = useUsers({ search });
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const openCreate = () => {
    setForm({ name: "", email: "", password: "", role_id: roles?.[0]?.id.toString() ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.role_id) return;
    createUser.mutate(
      { ...form, role_id: Number(form.role_id) },
      { onSuccess: () => setModalOpen(false) }
    );
  };

  const handleRoleChange = (userId: number, roleId: string) => {
    updateUser.mutate({ id: userId, payload: { role_id: Number(roleId) } });
  };

  const handleToggleActive = (userId: number, isActive: boolean) => {
    updateUser.mutate({ id: userId, payload: { is_active: !isActive } });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">{t("Users")}</h1>
          <p className="text-sm text-slate-500">{data?.total ?? 0} {t("total")}</p>
        </div>
        {hasPermission("users.create") && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus size={16} />
            {t("Add User")}
          </button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Search users…")}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">{t("Name")}</th>
              <th className="px-4 py-3">{t("Email")}</th>
              <th className="px-4 py-3">{t("Role")}</th>
              <th className="px-4 py-3">{t("Joined")}</th>
              <th className="px-4 py-3">{t("Status")}</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  {t("No users yet.")}
                </td>
              </tr>
            ) : (
              data?.items.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {u.name}
                    {u.id === currentUser?.id && <span className="ml-1.5 text-xs text-slate-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {hasPermission("users.edit") ? (
                      <select
                        value={u.role_id ?? ""}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        {roles?.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-600">{u.role_name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      disabled={u.id === currentUser?.id || !hasPermission("users.edit")}
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                        u.is_active ? "bg-success-light text-success" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {u.is_active ? t("Active") : t("Inactive")}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasPermission("users.delete") && u.id !== currentUser?.id && (
                      <button
                        onClick={() => deleteUser.mutate(u.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-danger-light hover:text-danger"
                        aria-label={t("Delete user")}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t("Add user")}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">{t("Name")}</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">{t("Email")}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">{t("Password")}</label>
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">{t("Role")}</label>
            <select
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {roles?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.email || form.password.length < 8 || createUser.isPending}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {createUser.isPending ? t("Adding…") : t("Add user")}
          </button>
        </div>
      </Modal>
    </div>
  );
}