// src/api/sales.js
import { api } from "./axios";

/**
 * Create a sale (purchase).
 * payload example:
 * {
 *   items: [{ product_id: 1, quantity: 2 }, ...],
 *   total_amount: 1299.50
 * }
 */
export async function createSale(payload) {
  const res = await api.post("/sales", payload);
  return res.data;
}
