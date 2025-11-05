// src/api/auth.js
import api, { csrfApi } from "../api/axios";

/**
 * Fetch CSRF cookie and ensure it's set before any request
 */
export const getCsrfCookie = async () => {
  try {
    const response = await csrfApi.get("/sanctum/csrf-cookie");

    // Small delay ensures browser sets cookie before next request
    await new Promise((resolve) => setTimeout(resolve, 50));

    return response;
  } catch (error) {
    console.error("CSRF cookie fetch failed:", error);
    throw error;
  }
};

/**
 * Login user
 * Automatically sends device timezone to backend
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - Axios response
 */
export const login = async (credentials) => {
  try {
    await getCsrfCookie();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await api.post("/login", {
      ...credentials,
      timezone,
    });

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Logout user
 * Optionally sends device timezone to backend if needed
 */
export const logout = async () => {
  try {
    await getCsrfCookie();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await api.post("/logout", { timezone });
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

/**
 * Get authenticated user
 * @returns {Promise<Object>} - User object
 */
export const getUser = async () => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    console.error("Fetching user failed:", error);
    throw error;
  }
};
