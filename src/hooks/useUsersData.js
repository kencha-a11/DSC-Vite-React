//src/hooks/useUsersData.js
import { useQuery } from "@tanstack/react-query";
import { getUsersData } from "../services/userServices";

export function useUsersData() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersData,
    staleTime: 1000 * 60,
    retry: 1,
  });
}
