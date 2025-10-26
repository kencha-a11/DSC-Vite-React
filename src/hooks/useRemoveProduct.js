import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMultipleProducts } from "../services/productServices";

export function useRemoveProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMultipleProducts,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
}
