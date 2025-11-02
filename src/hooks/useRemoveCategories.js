import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useRemoveCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryNames) => {
      console.log("🔍 Attempting to delete categories:", categoryNames);
      
      try {
        // ✅ OPTION 1: If your api already has /api prefix
        const response = await api.delete("/categories/multiple", {
          data: { categories: categoryNames },
        });
        
        console.log("✅ Delete successful:", response.data);
        return response.data;
        
      } catch (error) {
        console.error("❌ Delete failed:", {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
          status: error.response?.status,
          message: error.response?.data?.message,
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
}