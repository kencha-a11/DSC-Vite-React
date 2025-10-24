import api from "../api/axios";

/**
 * Fetch all categories
 */
export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}

/**
 * Create a new category with assigned products
 * @param {{ category_name: string, products: number[] }} data
 */
export async function createCategory(data) {
  const response = await api.post("/categories", data);
  return response.data;
}