import api from "../api/axios";

/**
 * Fetch all categories
 */
export async function getCategories() {
  console.log("🔵 getCategories called");
  console.log("🔵 Axios baseURL:", api.defaults.baseURL);
  const response = await api.get("/categories");
  console.log("✅ Categories fetched:", response.data);
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