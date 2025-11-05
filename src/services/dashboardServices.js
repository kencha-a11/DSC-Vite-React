import api from "../api/axios";

// ==================== Manager Dashboard ====================

/**
 * Fetches summary data for manager dashboard
 * @param {number} year - Optional year filter
 * @param {number} days - Optional recent days filter
 */
export const getManagerDashboardData = async (year, days) => {
  const response = await api.get("/dashboard/manager", {
    params: { year, days },
  });
  return response.data;
};

/**
 * Fetch paginated Non-Selling Products
 * @param {number} page - Current page for infinite scroll
 * @param {number} days - Filter for products not selling in last X days
 */
export const getNonSellingProducts = async (page = 1, days = 30) => {
  const response = await api.get("/dashboard/manager/non-selling", {
    params: { page, days },
  });
  return response.data;
};

/**
 * Fetch paginated Low Stock Alerts
 * @param {number} page - Current page for infinite scroll
 */
export const getLowStockAlerts = async (page = 1) => {
  const response = await api.get("/dashboard/manager/low-stock", {
    params: { page },
  });
  return response.data;
};

// ==================== Admin Dashboard ====================

/**
 * Fetch summary data for admin dashboard
 */
export const getAdminDashboardData = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

// ==================== Cashier Dashboard ====================

/**
 * Fetch main cashier dashboard summary
 */
export const getCashierDashboardData = async () => {
  const response = await api.get("/dashboard/cashier");
  return response.data;
};

/**
 * Fetch paginated inventory items
 * @param {number} page - Current page for infinite scroll
 * @param {string} search - Search term for filtering products
 */
export const getCashierInventory = async (page = 1, search = "") => {
  const response = await api.get("/dashboard/cashier/inventory", {
    params: {
      page,
      search: search || undefined, // Only send if not empty
    },
  });
  return response.data;
};

/**
 * Fetch paginated time logs with optional date filter
 * @param {number} page - Current page for infinite scroll
 * @param {string} date - Optional date filter in YYYY-MM-DD format
 */
export const getCashierTimeLogs = async (page = 1, date = "") => {
  const response = await api.get("/dashboard/cashier/time-logs", {
    params: {
      page,
      date: date || undefined, // ✅ Send date to backend for filtering
    },
  });
  return response.data;
};

/**
 * Fetch paginated sales logs with optional date filter
 * @param {number} page - Current page for infinite scroll
 * @param {string} date - Optional date filter in YYYY-MM-DD format
 */
export const getCashierSalesLogs = async (page = 1, date = "") => {
  const response = await api.get("/dashboard/cashier/sales-logs", {
    params: {
      page,
      date: date || undefined, // ✅ Send date to backend for filtering
    },
  });
  return response.data;
};