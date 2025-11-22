import axios from "axios"; // Import Axios for HTTP requests

console.log("🚀 Axios module loaded!"); // Confirm Axios is loaded

// ------------------------------
// Environment & Base URLs
// ------------------------------
let RAW_API_URL = import.meta.env.VITE_API_BASE_URL; // Load base API URL from Vite environment
console.log("🌐 Loaded VITE_API_BASE_URL:", RAW_API_URL);

const SERVER_URL = RAW_API_URL.replace(/\/api\/?$/, ""); 
// Remove trailing '/api' if present to get server root URL
console.log("🌐 Computed SERVER_URL (root for auth/CSRF):", SERVER_URL);

const BASE_API_URL = RAW_API_URL.replace(/\/$/, ""); // Ensure no trailing slash for API
console.log("🌐 Computed BASE_API_URL (for /api routes):", BASE_API_URL);

const BASE_CSRF_URL = SERVER_URL; // CSRF requests go to root server URL
console.log("🌐 Computed BASE_CSRF_URL (for CSRF/auth):", BASE_CSRF_URL);

console.group("🌐 Axios Environment Info"); 
console.log("🔹 RAW_API_URL:", RAW_API_URL);
console.log("🔹 SERVER_URL:", SERVER_URL);
console.log("🔹 API Base URL (BASE_API_URL):", BASE_API_URL);
console.log("🔹 CSRF Base URL (BASE_CSRF_URL):", BASE_CSRF_URL);
console.groupEnd();

// ------------------------------
// Helper: Get cookie by name
// ------------------------------
const getCookie = (name) => {
  // Parse document.cookie into key/value pairs
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("="); // Split each cookie
    acc[key] = value; // Add to accumulator
    return acc;
  }, {});
  const val = cookies[name] || null; // Return cookie value or null
  console.log(`🍪 getCookie("${name}") →`, val);
  return val;
};

// ------------------------------
// Axios Instances
// ------------------------------
export const csrfApi = axios.create({
  baseURL: BASE_CSRF_URL, // CSRF requests go to root
  withCredentials: true, // Send cookies
  headers: {
    Accept: "application/json", 
    "Content-Type": "application/json", 
    "X-Requested-With": "XMLHttpRequest", // Identify AJAX request
  },
});
console.log("🔹 csrfApi instance created. BaseURL:", BASE_CSRF_URL);

export const apiInstance = axios.create({
  baseURL: BASE_API_URL, // Main API base URL (/api)
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN", // Laravel CSRF cookie
  xsrfHeaderName: "X-XSRF-TOKEN", // Header to send CSRF token
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
console.log("🔹 apiInstance created. BaseURL:", BASE_API_URL);

// ------------------------------
// Normalize Dates to UTC
// ------------------------------
const normalizeToUTC = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item instanceof Date) val[i] = item.toISOString(); 
        else if (typeof item === "object") normalizeToUTC(item);
      });
    } else if (val instanceof Date) obj[key] = val.toISOString();
    else if (val && typeof val === "object") normalizeToUTC(val);
  }
};

// ------------------------------
// CSRF Initialization
// ------------------------------
let csrfInitialized = false; // Track CSRF initialization

export const initCsrf = async () => {
  if (csrfInitialized) {
    console.log("🔹 CSRF already initialized. Returning token...");
    return getCookie("XSRF-TOKEN"); // Return existing token
  }

  console.log("🔹 initCsrf called... requesting CSRF cookie");
  const response = await csrfApi.get("/sanctum/csrf-cookie", {
    headers: { "X-Skip-Interceptor": "true" }, // Avoid interceptor loop
  });
  console.log("✅ CSRF cookie requested. Status:", response.status);

  // Small delay to ensure cookie is set in browser
  await new Promise((resolve) => setTimeout(resolve, 100));

  csrfInitialized = true; // Mark CSRF as initialized
  const xsrfToken = getCookie("XSRF-TOKEN"); 

  console.group("🍪 Current Cookies (JS-readable)");
  console.log("🔹 XSRF-TOKEN:", xsrfToken ? "✅ Present" : "❌ Missing");
  console.log("🔹 laravel_session: ❌ HttpOnly (cannot read via JS)");
  console.groupEnd();

  return xsrfToken;
};

// ------------------------------
// Interceptors
// ------------------------------
csrfApi.interceptors.request.use(async (config) => {
  console.log("📡 csrfApi Request interceptor → URL:", config.url);

  if (config.headers["X-Skip-Interceptor"]) return config; // Skip interceptor if set

  config.headers["X-Device-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const token = await initCsrf(); // Ensure CSRF token exists
  if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);

  return config;
});

apiInstance.interceptors.request.use(async (config) => {
  console.log("📡 apiInstance Request interceptor → URL:", config.url);

  config.headers["X-Device-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (config.data) normalizeToUTC(config.data); // Convert all Date objects to UTC
  if (!config.headers["X-XSRF-TOKEN"]) {
    const token = await initCsrf(); 
    if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  console.log("📡 Final API Request →", config.baseURL + config.url);
  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    console.log("📤 API Response → URL:", response.config.url, "Status:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    console.warn("⚠️ API Response error → URL:", originalRequest?.url, "Status:", status);

    if (status === 419 && !originalRequest._retry) {
      console.log("🔹 CSRF expired → retrying request:", originalRequest.url);
      originalRequest._retry = true;
      await initCsrf();
      return apiInstance(originalRequest); // Retry request
    }

    if ([502, 503, 504].includes(status) && !originalRequest._retry) {
      console.log("🔹 Server error → retrying after 2s:", originalRequest.url);
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return apiInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ------------------------------
// Auto-init CSRF at startup
// ------------------------------
(async () => {
  try {
    console.log("🔹 Auto-init CSRF at startup...");
    await initCsrf();
    console.log("🔹 CSRF initialized at startup ✅");
  } catch (err) {
    console.warn("⚠️ Failed to initialize CSRF at startup", err);
  }
})();

// ------------------------------
// Smart universal API wrapper
// ✅ FIXED: Strips duplicate /api prefix
// ------------------------------
const api = new Proxy(apiInstance, {
  get(target, prop) {
    if (typeof target[prop] === "function") {
      return async (...args) => {
        let [url, config] = args;
        const authRoutes = ["/login", "/logout", "/sanctum/csrf-cookie"];
        const instance = authRoutes.some((r) => url.startsWith(r)) ? csrfApi : apiInstance;

        // ✅ FIX: If using apiInstance and URL starts with /api/, strip it
        // because baseURL already has /api
        if (instance === apiInstance && url.startsWith("/api/")) {
          url = url.substring(4); // "/api/dashboard" → "/dashboard"
          args[0] = url;
          console.log("🔧 Stripped duplicate /api prefix. New URL:", url);
        }

        console.log(`🔹 Proxy → Using ${instance === csrfApi ? "csrfApi" : "apiInstance"} for URL:`, url);
        return instance[prop](...args);
      };
    }
    return target[prop];
  },
});

export { api };
export default api;