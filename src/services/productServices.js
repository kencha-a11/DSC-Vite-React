// src/services/productServices.js
import api from "../api/axios";

/**
 * Fetch products from API and normalize the shape for the frontend.
 */
export async function getProductsData() {
  const response = await api.get("/products");
  const raw = response?.data ?? [];

  return raw.map((p) => {
    const placeholder = `https://via.placeholder.com/64?text=${encodeURIComponent(
      (p.name || "P").charAt(0).toUpperCase()
    )}`;

    return {
      id: p.id,
      name: p.name ?? p.title ?? "Unnamed product",
      categories: Array.isArray(p.categories) ? p.categories : [],
      price: Number(p.price ?? 0),
      stock_quantity: p.stock_quantity ?? p.stock ?? 0,
      low_stock_threshold: p.low_stock_threshold ?? 10,
      status: p.status ?? "stock",
      image: p.image ?? p.image_url ?? p.photo ?? placeholder,
      created_at: p.created_at,
      updated_at: p.updated_at,
    };
  });
}

/**
 * Fetch categories from API
 */
export async function getCategoriesData() {
  const response = await api.get("/categories");
  return response?.data ?? [];
}

/**
 * Create a new product
 */
export async function createProduct(formData) {
  const response = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Update an existing product
 * @param {number} id - Product ID
 * @param {FormData} formData - Updated product data
 */
export async function updateProduct(id, formData) {
  const response = await api.post(`/products/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Delete a product
 * @param {number} id - Product ID
 */
export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}

export async function removeMultipleProducts(data) {
  const response = await api.delete("/products/multiple", { data });
  return response.data;
}