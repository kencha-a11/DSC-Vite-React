import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboardServices";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"], // unique key for caching
    queryFn: getDashboardData, // API function
    staleTime: 1000 * 60, // cache data for 1 minute
    retry: 1, // retry once if request fails
  });
}
