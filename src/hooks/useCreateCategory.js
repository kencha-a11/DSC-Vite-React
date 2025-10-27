// src/hooks/useCreateCategory.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory as createCategoryService } from "../services/categoryServices";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await createCategoryService(data);
    },
    retry: false, // important: prevents multiple retries
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["products"]);
    },
  });
}
