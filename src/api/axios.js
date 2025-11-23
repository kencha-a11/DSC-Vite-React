import axios from "axios";
import { debugXsrf } from "./xsrf";

console.log("🚀 Axios module loaded!");
debugXsrf();

// ------------------------------
// Base URLs
// ------------------------------
const BASE_CSRF_URL = import.meta.env.VITE_CSRF_BASE_URL || "/"; // frontend root, handled by Vercel
const BASE_API_URL = "/api"; // all API requests proxied via vercel.json

console.group("🌐 Axios Environment Info");
console.log("🔹 API Base URL:", BASE_API_URL);
console.log("🔹 CSRF Base URL:", BASE_CSRF_URL);
console.groupEnd();

// ------------------------------
// Helper: Get cookie
// ------------------------------
const getCookie = (name) => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key.trim()] = value;
    return acc;
  }, {});
  return cookies[name] || null;
};

// ------------------------------
// Axios Instances
// ------------------------------
export const csrfApi = axios.create({
  baseURL: BASE_CSRF_URL,
  withCredentials: true,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

export const apiInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
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
// CSRF Initialization
// ------------------------------
let csrfInitialized = false;

export const initCsrf = async () => {
  if (csrfInitialized) return getCookie("XSRF-TOKEN");

  try {
    const response = await csrfApi.get("/sanctum/csrf-cookie", {
      headers: { "X-Skip-Interceptor": "true" },
    });
    console.log("✅ CSRF cookie requested → Status:", response.status);

    await new Promise(resolve => setTimeout(resolve, 100));
    csrfInitialized = true;

    const xsrfToken = getCookie("XSRF-TOKEN");
    console.log("🔹 XSRF-TOKEN:", xsrfToken ? "✅ Present" : "❌ Missing");
    return xsrfToken;
  } catch (error) {
    console.error("❌ CSRF request failed:", error);
    return null;
  }
};

// ------------------------------
// Interceptors
// ------------------------------
csrfApi.interceptors.request.use(async (config) => {
  if (config.headers["X-Skip-Interceptor"]) return config;
  config.headers["X-Device-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const token = await initCsrf();
  if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  return config;
});

apiInstance.interceptors.request.use(async (config) => {
  config.headers["X-Device-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (config.data) normalizeToUTC(config.data);

  if (!config.headers["X-XSRF-TOKEN"]) {
    const token = await initCsrf();
    if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  return config;
});

apiInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      await initCsrf();
      return apiInstance(originalRequest);
    }

    if ([502, 503, 504].includes(status) && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ------------------------------
// Auto-init CSRF at startup
// ------------------------------
(async () => {
  try { await initCsrf(); } catch (err) { console.error(err); }
})();

// ------------------------------
// Universal API Proxy
// ------------------------------
const api = new Proxy(apiInstance, {
  get(target, prop) {
    if (typeof target[prop] === "function") {
      return async (...args) => {
        let [url, config] = args;
        const authRoutes = ["/login", "/logout", "/sanctum/csrf-cookie"];
        const instance = authRoutes.some(r => url.startsWith(r)) ? csrfApi : apiInstance;

        if (instance === apiInstance && !url.startsWith("http") && !url.startsWith("/api")) {
          url = url.startsWith("/") ? "/api" + url : "/api/" + url;
          args[0] = url;
        }

        return instance[prop](...args);
      };
    }
    return target[prop];
  },
});

export { api };
export default api;
