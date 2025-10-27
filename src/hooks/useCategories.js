// src/hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoryServices";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 0, // always fetch fresh when refetched
  });
}
