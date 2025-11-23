import axios from "axios";

console.log("🚀 Axios module loaded - Token-based auth");

// ------------------------------
// Base URLs
// ------------------------------
// UPDATED: Dynamic environment API URL
const BASE_API_URL = import.meta.env.VITE_API_URL || "/api";

console.group("🌐 Axios Environment Info");
console.log("🔹 API Base URL:", BASE_API_URL);
console.log("🔹 Auth Method: Bearer Token (localStorage)");
console.groupEnd();

// ------------------------------
// Axios Instance
// ------------------------------
export const apiInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: { 
    Accept: "application/json", 
    "Content-Type": "application/json" 
  },
  withCredentials: false, // Token-based auth doesn't need cookies
});

// ------------------------------
// Normalize Dates to UTC
// ------------------------------
const normalizeToUTC = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val)) val.forEach((item, i) => {
      if (item instanceof Date) val[i] = val.toISOString();
      else if (typeof item === "object") normalizeToUTC(item);
    });
    else if (val instanceof Date) obj[key] = val.toISOString();
    else if (typeof val === "object") normalizeToUTC(val);
  }
};

// ------------------------------
// Request Interceptor - Add Token
// ------------------------------
apiInstance.interceptors.request.use((config) => {
  // Add timezone header
  config.headers["X-Device-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Add token from localStorage automatically
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔹 Authorization header set with token:", token.substring(0, 20) + "...");
  }

  // Normalize dates in request body
  if (config.data) normalizeToUTC(config.data);

  return config;
});

// ------------------------------
// Response Interceptor - Handle Errors
// ------------------------------
apiInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Token invalid/expired - logout
    if (status === 401 && !originalRequest._retry) {
      console.warn("⚠️ Token invalid or expired. Logging out...");
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Server errors - retry once
    if ([502, 503, 504].includes(status) && !originalRequest._retry) {
      console.warn(`⚠️ Server error ${status}. Retrying request in 2s...`);
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiInstance(originalRequest);
    }

    console.error("❌ API request failed with status:", status, error?.response?.data);
    return Promise.reject(error);
  }
);

// Export both apiInstance and api (they're the same now)
export const api = apiInstance;
export default api;
