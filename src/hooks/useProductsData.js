// src/hooks/useProductsData.js
import { useQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/productServices";

export function useProductsData() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProductsData,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
