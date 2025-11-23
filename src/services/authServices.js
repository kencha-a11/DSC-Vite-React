// src/services/authServices.js
// ------------------------------
// Handles login, logout, and fetching authenticated user
// Token-based authentication with localStorage
// ------------------------------

import { api } from "../api/axios";

// ------------------------------
// Login user (returns user + token)
// ------------------------------
export const login = async (credentials) => {
  console.log("🔹 login called with credentials:", credentials);

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = { ...credentials, timezone };

    console.log("🔹 Sending POST to /login with payload:", payload);

    // POST /login → Laravel returns { user, token, message }
    const response = await api.post('/login', payload);

    console.log("✅ Login successful:", response.data);

    // Store token in localStorage
    localStorage.setItem('auth_token', response.data.token);
    console.log("🔹 Token stored:", response.data.token.substring(0, 20) + "...");

    // Immediately fetch user with token
    const user = await getUser();

    return {
      ...response.data,
      user, // authenticated user object
    };
  } catch (error) {
    console.error("❌ Login failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);
    throw error;
  }
};

// ------------------------------
// Logout user
// ------------------------------
export const logout = async () => {
  console.log("🔹 logout called");

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("🔹 Sending POST to /logout with timezone:", timezone);

    await api.post('/logout', null, {
      headers: { "X-Device-Timezone": timezone },
    });

    console.log("✅ Logout successful");

    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("❌ Logout failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);

    // Clear token anyway
    localStorage.removeItem('auth_token');

    throw error;
  }
};

// ------------------------------
// Get authenticated user
// ------------------------------
export const getUser = async () => {
  console.log("🔹 getUser called");

  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log("⚠️ No token found in localStorage");
    throw new Error('No auth token');
  }

  try {
    console.log("🔹 Sending GET to /user");

    // Axios interceptor automatically attaches Authorization header
    const { data } = await api.get('/user');

    console.log("✅ Fetched user:", data);

    return data;
  } catch (error) {
    console.error("❌ Fetching user failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);

    throw error;
  }
};
