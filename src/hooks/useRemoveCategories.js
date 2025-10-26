import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCategories } from "../services/categoryServices";

export const useRemoveCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCategories,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["products"]);
    },
  });
};
