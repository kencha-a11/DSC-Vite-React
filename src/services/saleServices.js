// src/api/sales.js
import { api } from "../api/axios";

export async function createTransaction(payload) {
  try {
    const res = await api.post("/sales/store", payload);
    return res.data;
  } catch (error) {
    console.error("Transaction failed:", error);
    console.error("Response:", error.response?.data);
    throw error;
  }
}
