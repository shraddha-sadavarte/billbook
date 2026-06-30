import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
    staleTime: 30_000, // dashboard numbers don't need to refetch on every tab focus
  });
}
