// src/api/axios.js
import axios from "axios";

// ------------------------------
// CSRF Axios Instance (no /api prefix)
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

// ------------------------------
// Authenticated API Axios Instance (/api prefix)
// ------------------------------
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
// Utility: get CSRF token from cookies
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
// Initialize CSRF
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
// Request interceptor: attach CSRF token
// ------------------------------
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) config.headers["X-XSRF-TOKEN"] = csrfToken;
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// Response interceptor: retry 419 once
// ------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      await initCsrf(); // fetch new CSRF token
      return api(originalRequest); // retry original request
    }
    return Promise.reject(error);
  }
);

export default api;
