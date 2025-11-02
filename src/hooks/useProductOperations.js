import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  updateProduct, 
  deleteProduct, 
  restockProduct, 
  deductProduct 
} from "../services/productServices";

/**
 * Hook for updating a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
}

/**
 * Hook for deleting a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
}

/**
 * Hook for restocking a product
 */
export function useRestockProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => restockProduct(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
}

/**
 * Hook for deducting stock from a product
 */
export function useDeductProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity, reason }) => deductProduct(id, { quantity, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
}