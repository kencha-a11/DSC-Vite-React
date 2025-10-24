// src/services/logService.js
import api from "../api/axios";

/**
 * Fetch Time Logs with optional query params
 * @param {Object} params - Filters: user_id, status, date, page
 */
export async function getTimeLogs(params = {}) {
  const response = await api.get("/logs/time", { params });
  return response?.data?.data ?? []; // paginate returns {data, links, meta} structure
}

/**
 * Fetch sales logs from the server.
 * @param {Object} params - Optional query parameters (e.g., { userId: 1, date: '2025-10-15' })
 * @returns {Promise<Array>} Array of sales log objects
 */
export async function getSalesLogs(params = {}) {
  try {
    const response = await api.get("/logs/sales", { params });
    // Safely return the data array or an empty array if undefined

    return Array.isArray(response?.data?.data) ? response.data.data : [];
  } catch (error) {
    console.error("Failed to fetch sales logs:", error);
    return []; // fallback to empty array to prevent breaking UI
  }
}
/**
 * Fetch Inventory Logs with optional query params
 * @param {Object} params - Filters: user_id, action, product_id, page
 */
export async function getInventoryLogs(params = {}) {
  const response = await api.get("/logs/inventory", { params });
  return response?.data?.data ?? [];
}
