import { apiClient } from "./client";
import type { Role, PermissionCatalog } from "../types";

export interface RolePayload {
  name: string;
  description?: string | null;
  permissions: string[];
}

export async function listRoles() {
  const { data } = await apiClient.get<{ items: Role[] }>("/roles");
  return data.items;
}

export async function getRole(id: number) {
  const { data } = await apiClient.get<Role>(`/roles/${id}`);
  return data;
}

export async function getPermissionCatalog() {
  const { data } = await apiClient.get<PermissionCatalog>("/roles/permissions");
  return data;
}

export async function createRole(payload: RolePayload) {
  const { data } = await apiClient.post<Role>("/roles", payload);
  return data;
}

export async function updateRole(id: number, payload: Partial<RolePayload>) {
  const { data } = await apiClient.put<Role>(`/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id: number) {
  await apiClient.delete(`/roles/${id}`);
}
