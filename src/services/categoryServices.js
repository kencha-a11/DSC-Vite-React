// src/services/categoryServices.js
import api from "../api/axios";

/** 🟣 Fetch all categories */
export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}

/** 🟣 Create a new category with assigned products */
export async function createCategory(data) {
  console.log("📤 Sending to backend:", data);
  const response = await api.post("/categories", data);
  return response.data;
}

/** 🟣 Remove multiple categories by name */
export async function removeCategories(categoryNames) {
  const uniqueCategories = [...new Set(categoryNames)]; // Prevent duplicates
  const response = await api.delete("/categories/multiple", {
    data: { categories: uniqueCategories },
  });
  return response.data;
}
