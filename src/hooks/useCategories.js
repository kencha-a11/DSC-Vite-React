// src/hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoryServices";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getCategories();
      return [
        { id: 0, category_name: "All" },
        { id: -1, category_name: "Uncategorized" }, // 👈 Added
        ...data,
      ];
    },
    staleTime: 0,
  });
}
