import axios from "axios";

// ------------------------------
// Utility: CSRF token extractor
// ------------------------------
const getCsrfTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") return decodeURIComponent(value);
  }
  return null;
};

// ------------------------------
// Create Axios instances
// ------------------------------
export const csrfApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ------------------------------
// Utility: Normalize Dates to UTC
// ------------------------------
function normalizeToUTC(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item instanceof Date) val[i] = item.toISOString();
        else if (typeof item === "object") normalizeToUTC(item);
      });
    } else if (val instanceof Date) {
      obj[key] = val.toISOString();
    } else if (val && typeof val === "object") {
      normalizeToUTC(val);
    }
  }
}

// ------------------------------
// Initialize CSRF (helper)
// ------------------------------
export const initCsrf = async () => {
  try {
    await csrfApi.get("/sanctum/csrf-cookie");
    console.log("CSRF token initialized");
  } catch (err) {
    console.error("Failed to initialize CSRF:", err);
  }
};

// ------------------------------
// Add interceptors (AFTER definitions)
// ------------------------------

// ✅ Add timezone to every CSRF request
csrfApi.interceptors.request.use((config) => {
  config.headers["X-Device-Timezone"] =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});

// ✅ Main API interceptor (with CSRF + UTC normalization)
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) config.headers["X-XSRF-TOKEN"] = csrfToken;

    config.headers["X-Device-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    normalizeToUTC(config.data);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 419 retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      await initCsrf();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
