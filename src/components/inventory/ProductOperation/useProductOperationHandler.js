import { 
  useUpdateProduct, 
  useDeleteProduct, 
  useRestockProduct, 
  useDeductProduct 
} from "../../../hooks/useProductOperations";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Centralized handler for all product operations
 * Ensures products list refetches correctly after each action
 */
export function useProductOperationHandler({ setState, setMessage }) {
  const queryClient = useQueryClient();

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const restockProductMutation = useRestockProduct();
  const deductProductMutation = useDeductProduct();

  // 🔄 Force full product list refresh
  const refreshProducts = () => {
    queryClient.removeQueries({ queryKey: ["products"], exact: false });
    queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
  };

  /**
   * 🧩 Handle Edit Product
   * Supports FormData from EditProduct modal
   */
  const handleEditProduct = async (productId, formData) => {
    try {
      await updateProductMutation.mutateAsync({ id: productId, formData });
      setState?.setEditProduct?.(null);
      setMessage?.({ type: "success", text: "Product updated successfully!" });
      refreshProducts(); // ✅ force full refetch
    } catch (error) {
      console.error("❌ Edit product error:", error);
      setMessage?.({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update product" 
      });
      throw error;
    }
  };

  /**
   * 📦 Handle Restock Product
   */
  const handleRestockProduct = async (productId, quantity) => {
    try {
      await restockProductMutation.mutateAsync({ id: productId, quantity });
      setState?.setRestockProduct?.(null);
      setMessage?.({ type: "success", text: "Product restocked successfully!" });
      refreshProducts();
    } catch (error) {
      console.error("❌ Restock product error:", error);
      setMessage?.({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to restock product" 
      });
      throw error;
    }
  };

  /**
   * ➖ Handle Deduct Product
   */
  const handleDeductProduct = async (productId, quantity, reason) => {
    try {
      await deductProductMutation.mutateAsync({ id: productId, quantity, reason });
      setState?.setDeductProduct?.(null);
      setMessage?.({ type: "success", text: "Stock deducted successfully!" });
      refreshProducts();
    } catch (error) {
      console.error("❌ Deduct product error:", error);
      setMessage?.({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to deduct stock" 
      });
      throw error;
    }
  };

  /**
   * 🗑️ Handle Remove Product
   */
  const handleRemoveProduct = async (productId) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      setState?.setRemoveProduct?.(null);
      setMessage?.({ type: "success", text: "Product removed successfully!" });
      refreshProducts();
    } catch (error) {
      console.error("❌ Remove product error:", error);
      setMessage?.({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to remove product" 
      });
      throw error;
    }
  };

  return {
    handleEditProduct,
    handleRestockProduct,
    handleDeductProduct,
    handleRemoveProduct,
    isLoading: {
      edit: updateProductMutation.isPending,
      restock: restockProductMutation.isPending,
      deduct: deductProductMutation.isPending,
      remove: deleteProductMutation.isPending,
    },
  };
}
