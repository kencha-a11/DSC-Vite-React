// src/hooks/useProductsData.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/productServices";

/**
 * Hook for fetching products with infinite scroll, search, category, and status filter
 */
export function useProductsData({ 
  search = "", 
  category = "All", 
  status = "", // ✅ Add status parameter
  perPage = 10 
} = {}) {
  return useInfiniteQuery({
    queryKey: ["products", search, category, status], // ✅ Include status in query key
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProductsData(
        pageParam, 
        perPage, 
        search, 
        category,
        status // ✅ Pass status to API call
      );
      // Return exactly the shape needed
      return {  
        data: response.data ?? [],
        current_page: response.current_page,
        last_page: response.last_page,
        hasMore: response.hasMore,
      };
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.current_page + 1 : undefined,
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}