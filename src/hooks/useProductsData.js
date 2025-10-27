import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/productServices";
import { extractDataFromResponse } from "../utils/apiHelpers";

/**
 * Hook for fetching products with infinite scroll, search, and category filter
 */

export function useProductsData({ search = "", category = "All", perPage = 10 } = {}) {
  return useInfiniteQuery({
    queryKey: ["products", search, category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProductsData(pageParam, perPage, search, category);
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
