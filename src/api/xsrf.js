// src/utils/xsrf.js
// ------------------------------
// Purpose: Debug XSRF / CSRF token in browser
// Can be used independently or imported in authServices / axios
// ------------------------------

/**
 * Parse document.cookie into an object
 */
export const parseCookies = () => {
  return document.cookie.split(";").reduce((acc, cookie) => {
    const [rawKey, rawValue] = cookie.split("=");
    const key = rawKey?.trim();
    const value = rawValue ? decodeURIComponent(rawValue.trim()) : "";
    if (key) acc[key] = value;
    return acc;
  }, {});
};

/**
 * Log current CSRF / session cookies
 */
export const logXsrfCookies = () => {
  const cookies = parseCookies();

  console.group("🔹 XSRF / CSRF Cookie Debug");
  console.log("🍪 XSRF-TOKEN:", cookies["XSRF-TOKEN"] ? "✅ Present → " + cookies["XSRF-TOKEN"] : "❌ Missing");
  console.log("🍪 laravel_session: ❌ HttpOnly (cannot read from JS)");
  console.groupEnd();
};

/**
 * Log request headers and token
 * @param {Object} headers Axios / Fetch headers object
 */
export const logXsrfHeaders = (headers) => {
  console.group("🔹 XSRF / CSRF Header Debug");
  console.log("📡 X-XSRF-TOKEN header:", headers["X-XSRF-TOKEN"] ? "✅ Present → " + headers["X-XSRF-TOKEN"] : "❌ Missing");
  console.groupEnd();
};

/**
 * Utility to check if XSRF token exists and return it
 */
export const getXsrfToken = () => {
  const cookies = parseCookies();
  return cookies["XSRF-TOKEN"] || null;
};

/**
 * Quick debug function
 * Logs cookies and current token
 */
export const debugXsrf = () => {
  const token = getXsrfToken();
  logXsrfCookies();
  console.log("🔹 Current XSRF-TOKEN value:", token ? token : "❌ Not Found");
};
