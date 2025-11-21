import axios from "axios";

console.log("🚀 axios.js loaded!");

// ------------------------------
// Environment & Base URLs
// ------------------------------
const isDev = import.meta.env.DEV;
const BACKEND_URL = "https://dsc-laravel.onrender.com";

// In dev → use VITE_API_BASE_URL
// In prod → ALWAYS use backend URL directly
const BASE_URL = isDev
  ? import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/api`
  : `${BACKEND_URL}/api`;

const BASE_CSRF_URL = isDev
  ? (import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || BACKEND_URL)
  : BACKEND_URL;

console.group("🌐 Axios Environment Info");
console.log("🔹 Environment:", isDev ? "Development" : "Production");
console.log("🔹 BASE_URL:", BASE_URL);
console.log("🔹 BASE_CSRF_URL:", BASE_CSRF_URL);
console.groupEnd();

// ------------------------------
// Axios Instances
// ------------------------------
export const csrfApi = axios.create({
  baseURL: BASE_CSRF_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ------------------------------
// Helper: Normalize Dates to UTC
// ------------------------------
const normalizeToUTC = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item instanceof Date) val[i] = val[i].toISOString();
        else if (typeof item === "object") normalizeToUTC(item);
      });
    } else if (val instanceof Date) obj[key] = val.toISOString();
    else if (val && typeof val === "object") normalizeToUTC(val);
  }
};

// ------------------------------
// Initialize CSRF Token
// ------------------------------
export const initCsrf = async () => {
  console.log("🔹 initCsrf called...");
  try {
    const response = await csrfApi.get("/sanctum/csrf-cookie");
    console.log("✅ CSRF cookie initialized. HTTP Status:", response.status);

    await new Promise((resolve) => setTimeout(resolve, 200));
  } catch (err) {
    console.error("❌ initCsrf failed:", err.message || err);
  }
};

// ------------------------------
// Interceptors
// ------------------------------
csrfApi.interceptors.request.use((config) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  config.headers["X-Device-Timezone"] = tz;
  console.log(`🔹 CSRF API request → ${config.url} | TZ: ${tz}`);
  return config;
});

api.interceptors.request.use((config) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  config.headers["X-Device-Timezone"] = tz;

  if (config.data) normalizeToUTC(config.data);

  console.log(
    "📡 API request →",
    config.method?.toUpperCase(),
    config.url,
    "| Data:",
    config.data || "(none)"
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Response OK →",
      response.config.url,
      "| Status:",
      response.status,
      "| Data:",
      response.data
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.warn(`⚠️ API error ${status} → ${originalRequest?.url}`);

    if (status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("🔄 CSRF expired — refreshing cookie...");
      await initCsrf();
      return api(originalRequest);
    }

    if ([502, 503, 504].includes(status) && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("🌐 Server unavailable — retrying in 1s...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
