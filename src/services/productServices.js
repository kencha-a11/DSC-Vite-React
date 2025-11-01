// src/services/productServices.js
import api from "../api/axios";
import { extractDataFromResponse } from "../utils/apiHelpers";

/**
 * Fetch paginated products with filters
 * @param {number} page - Current page number
 * @param {number} perPage - Items per page
 * @param {string} search - Search term
 * @param {string} category - Category filter (category name)
 * @param {string} status - Status filter ("stock", "low stock", "out of stock")
 */
export async function getProductsData(
  page = 1,
  perPage = 10,
  search = "",
  category = null,
  status = "" // ✅ Add status parameter
) {
  try {
    const params = new URLSearchParams({ page, perPage, search });

    // Add category filter (must be name)
    if (category && category !== "All") params.append("category", category);

    // ✅ Add status filter
    if (status) params.append("status", status);

    const response = await api.get(`/products?${params.toString()}`);

    return extractDataFromResponse(response);
  } catch (error) {
    console.error("Failed to fetch products:", error.response?.data ?? error);
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: perPage,
      total: 0,
      hasMore: false,
    };
  }
}

/**
 * Fetch categories
 */
export async function getCategoriesData() {
  const response = await api.get("/categories");
  return response?.data ?? [];
}

/**
 * Create a new product
 * @param {FormData} formData
 */
export async function createProduct(formData) {
  try {
    const response = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

/**
 * Update an existing product
 * @param {number} id - Product ID
 * @param {FormData} formData - Updated product data
 */
export async function updateProduct(id, formData) {
  try {
    const response = await api.post(`/products/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Delete a product
 * @param {number} id - Product ID
 */
export async function deleteProduct(id) {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

/**
 * Delete multiple products
 * @param {Array<number>} data - Array of product IDs
 */
export async function removeMultipleProducts(data) {
  try {
    const response = await api.delete("/products/multiple", { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    throw error;
  }
}
