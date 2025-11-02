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
  console.log("Sending to backend:", data);
  const response = await api.post("/categories", data);
  console.log("Response:", response);
  return response.data;
}

/**
 * Remove multiple categories by name
 * @param {{ categories: string[] }} data
 */
export async function removeCategories(data) {
  const response = await api.delete("/categories/multiple", { data });
  return response.data;
}
