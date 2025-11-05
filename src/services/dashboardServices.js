import api from "../api/axios";

// -------------------- Manager Dashboard --------------------
export const getManagerDashboardData = async (year, days) => {
  const response = await api.get("/dashboard/manager", {
    params: { year, days },
  });
  return response.data;
};

// 🧩 Fetch paginated Non-Selling Products (10 per page)
export const getNonSellingProducts = async (page = 1, days = 30) => {
  const response = await api.get("/dashboard/manager/non-selling", {
    params: { page, days },
  });
  return response.data; // Expect { data: [], meta: { current_page, last_page } }
};

// 🧩 Fetch paginated Low Stock Alerts (10 per page)
export const getLowStockAlerts = async (page = 1) => {
  const response = await api.get("/dashboard/manager/low-stock", {
    params: { page },
  });
  return response.data; // Expect { data: [], meta: { current_page, last_page } }
};

// -------------------- Admin Dashboard --------------------
export const getAdminDashboardData = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

// -------------------- Cashier Dashboard --------------------
// -------------------- Cashier Dashboard APIs --------------------

// Fetch main cashier dashboard summary
export const getCashierDashboardData = async () => {
  const response = await api.get("/dashboard/cashier");
  return response.data;
};

// Fetch paginated inventory items (default 10 per page)
export const getCashierInventory = async (page = 1) => {
  const response = await api.get("/dashboard/cashier/inventory", {
    params: { page },
  });
  return response.data; // Expect { data: [], meta: { current_page, last_page, per_page, total } }
};

// Fetch paginated time logs
export const getCashierTimeLogs = async (page = 1) => {
  const response = await api.get("/dashboard/cashier/time-logs", {
    params: { page },
  });
  return response.data; // Expect { data: [], meta: { current_page, last_page, per_page, total } }
};

// Fetch paginated sales logs
export const getCashierSalesLogs = async (page = 1) => {
  const response = await api.get("/dashboard/cashier/sales-logs", {
    params: { page },
  });
  return response.data; // Expect { data: [], meta: { current_page, last_page, per_page, total } }
};
