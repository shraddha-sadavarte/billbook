import { apiClient } from "./client";
import type { DashboardSummary } from "../types";

export type DashboardPeriod = "today" | "weekly" | "monthly" | "yearly" | "all";

export async function fetchDashboardSummary(period: DashboardPeriod = "all") {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary", {
    params: { period },
  });
  return data;
}
