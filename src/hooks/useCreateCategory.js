import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/categoryServices";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate the products or categories query so the UI refreshes
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["products"]);
    },
  });
}
