// src/services/productServices.js
import api from "../api/axios";

/**
 * Fetch products from API and normalize the shape for the frontend.
 * Ensures:
 * - product.category is a string (category name)
 * - product.image always exists (placeholder fallback)
 * - product.price is a number
 */
export async function getProductsData() {
  const response = await api.get("/products");
  const raw = response?.data ?? [];

  return raw.map((p) => {
    const categoryName =
      // backend uses category.category_name according to your example
      typeof p.category === "string"
        ? p.category
        : p.category?.category_name ?? p.category?.name ?? "";

    // nice placeholder that shows first letter if available
    const placeholder = `https://via.placeholder.com/64?text=${encodeURIComponent(
      (p.name || "P").charAt(0).toUpperCase()
    )}`;

    return {
      id: p.id,
      name: p.name ?? p.title ?? "Unnamed product",
      category: categoryName || "Uncategorized",
      price: Number(p.price ?? 0),
      stock: p.stock_quantity ?? p.stock ?? 0,
      // try several common image field names, fallback to placeholder
      image: p.image ?? p.image_url ?? p.photo ?? placeholder,
      raw: p, // keep original if you ever need it
    };
  });
}
