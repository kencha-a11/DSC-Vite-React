// src/api/auth.js
import api, { csrfApi, initCsrf } from "../api/axios";

/**
 * Ensure CSRF cookie is set before any request
 */
export const ensureCsrf = async () => {
  console.log("🔹 ensureCsrf called");
  await initCsrf();
};

/**
 * Login user
 * Sends timezone along with credentials
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  console.log("🔹 login called with credentials:", credentials);

  try {
    await ensureCsrf();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = { ...credentials, timezone };

    console.log("🔹 Sending POST /login with payload:", payload);
    const response = await api.post("/login", payload);

    console.log("✅ Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>}
 */
export const logout = async () => {
  console.log("🔹 logout called");

  try {
    await ensureCsrf();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("🔹 Sending POST /logout with timezone:", timezone);

    const response = await api.post("/logout", { timezone });
    console.log("✅ Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Logout failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);
    throw error;
  }
};

/**
 * Get authenticated user
 * @returns {Promise<Object>}
 */
export const getUser = async () => {
  console.log("🔹 getUser called");

  try {
    await ensureCsrf();

    console.log("🔹 Sending GET /user");
    const { data } = await api.get("/user");

    console.log("✅ Fetched user:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetching user failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);
    throw error;
  }
};
