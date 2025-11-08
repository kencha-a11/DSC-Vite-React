// src/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  removeCategories,
} from "../services/categoryServices";

/** 🔹 Fetch all categories */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

/** 🔹 Create new category */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
}

/** 🔹 Remove multiple categories */
export function useRemoveCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCategories,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("❌ Category deletion failed:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        details: error.response?.data?.errors,
      });
    },
  });
}
