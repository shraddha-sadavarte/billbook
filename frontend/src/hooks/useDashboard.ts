import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary, type DashboardPeriod } from "../api/dashboard";

export function useDashboardSummary(period: DashboardPeriod = "all") {
  return useQuery({
    queryKey: ["dashboard", "summary", period],
    queryFn: () => fetchDashboardSummary(period),
    staleTime: 30_000,
  });
}
