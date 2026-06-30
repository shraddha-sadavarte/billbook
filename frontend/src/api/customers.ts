import { apiClient } from "./client";
import type { Customer, PaginatedResponse } from "../types";

export interface CustomerPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
  gstin?: string | null;
}

export async function listCustomers(params: { page?: number; per_page?: number; search?: string } = {}) {
  const { data } = await apiClient.get<PaginatedResponse<Customer>>("/customers", { params });
  return data;
}

export async function getCustomer(id: number) {
  const { data } = await apiClient.get<Customer>(`/customers/${id}`);
  return data;
}

export async function createCustomer(payload: CustomerPayload) {
  const { data } = await apiClient.post<Customer>("/customers", payload);
  return data;
}

export async function updateCustomer(id: number, payload: Partial<CustomerPayload>) {
  const { data } = await apiClient.put<Customer>(`/customers/${id}`, payload);
  return data;
}

export async function deleteCustomer(id: number) {
  await apiClient.delete(`/customers/${id}`);
}
