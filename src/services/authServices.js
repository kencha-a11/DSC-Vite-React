// src/services/authServices.js
// ------------------------------
// Handles login, logout, and fetching authenticated user
// ⚠️ Must use csrfApi for Laravel Sanctum auth routes
// ------------------------------

import { csrfApi, initCsrf } from "../api/axios"; 
// Import csrfApi only (baseURL points to Laravel backend root)
// Do NOT import the 'api' proxy because it uses /api prefix
// Using apiInstance here would cause requests like /api/api/user → wrong

// ------------------------------
// Helper: Log cookies for debugging
// ------------------------------
const logCookies = () => {
  // Parse document.cookie into a key/value object
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("="); // Split key=value
    acc[key] = value; // Add to object
    return acc;
  }, {});

  // Log cookies for debugging CSRF / session issues
  console.group("🍪 Current Cookies (JS-readable)");
  console.log("🔹 XSRF-TOKEN:", cookies["XSRF-TOKEN"] ? "✅ Present" : "❌ Missing");
  console.log("🔹 laravel_session: ❌ HttpOnly (automatic, not JS-readable)");
  console.groupEnd();
};

// ------------------------------
// Ensure CSRF cookie is set before any request
// ------------------------------
export const ensureCsrf = async () => {
  console.log("🔹 ensureCsrf called");

  // Call initCsrf() to request CSRF cookie from Laravel
  await initCsrf();

  // Log current cookies after CSRF initialization
  logCookies();
};

// ------------------------------
// Login user
// ------------------------------
export const login = async (credentials) => {
  console.log("🔹 login called with credentials:", credentials);

  try {
    // Make sure CSRF token is present before login
    await ensureCsrf();

    // Attach user's timezone to payload (Laravel backend may store it)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = { ...credentials, timezone };

    console.log("🔹 Sending POST to /login (csrfApi - baseURL='')");
    console.log("🔹 Request payload:", payload);

    // POST /login → hits Laravel backend root directly
    const response = await csrfApi.post("/login", payload);

    console.log("✅ Login successful:", response.data);

    // Show cookies after login
    logCookies();

    return response.data; // Return Laravel response (user info / token)
  } catch (error) {
    // Login failed → log details for debugging
    console.error("❌ Login failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);

    logCookies(); // Show cookies at failure

    throw error; // Rethrow to handle in UI
  }
};

// ------------------------------
// Logout user
// ------------------------------
export const logout = async () => {
  console.log("🔹 logout called");

  try {
    // Ensure CSRF token is set before logout
    await ensureCsrf();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("🔹 Sending POST to /logout with timezone in header");

    // POST /logout → Laravel backend handles session termination
    const response = await csrfApi.post("/logout", null, {
      headers: { "X-Device-Timezone": timezone } // ✅ send timezone in header
    });

    console.log("✅ Logout successful:", response.data);

    // Log cookies after logout
    logCookies();

    return response.data;
  } catch (error) {
    console.error("❌ Logout failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);

    logCookies(); // Show cookies at failure
    throw error;
  }
};


// ------------------------------
// Get authenticated user
// ------------------------------
export const getUser = async () => {
  console.log("🔹 getUser called");

  try {
    // Ensure CSRF token is present → Laravel will reject request without it
    await ensureCsrf();

    console.log("🔹 Sending GET to /user (csrfApi - baseURL='')");

    // GET /user → fetches authenticated user from Laravel backend
    const { data } = await csrfApi.get("/user");

    console.log("✅ Fetched user:", data);

    // Show cookies after fetching user
    logCookies();

    return data; // Return user object
  } catch (error) {
    console.error("❌ Fetching user failed:", error);
    console.log("🔹 Response data:", error.response?.data);
    console.log("🔹 Response status:", error.response?.status);

    logCookies(); // Show cookies at failure
    throw error;
  }
};
