// src/api/sales.js
import { api } from "../api/axios";

export async function createTransaction(payload) {
  try {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payloadWithTimestamp = {
      ...payload,
      device_datetime: now.toISOString(), // precise device timestamp
      device_timezone: timezone,          // e.g., "Asia/Manila"
    };

    const res = await api.post("/sales/store", payloadWithTimestamp);
    return res.data;
  } catch (error) {
    console.error("Transaction failed:", error);
    console.error("Response:", error.response?.data);
    throw error;
  }
}
