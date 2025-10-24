// src/api/axios.js
import axios from "axios";

// Axios instance for authenticated API requests (uses /api prefix)
export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // send cookies with requests (important for Laravel Sanctum)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Laravel requires this for AJAX requests
  },
});

// Separate Axios instance for CSRF-related requests (no /api prefix)
export const csrfApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Utility function: extract CSRF token from browser cookies
const getCsrfTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value); // Laravel encodes the token
    }
  }
  return null;
};

// Add request interceptor: attach CSRF token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor: log API responses or errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

// Export default api instance for backward compatibility
export default api;
