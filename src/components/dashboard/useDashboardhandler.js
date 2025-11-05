// src/hooks/useDashboardHandler.js
import { useState, useEffect, useCallback } from "react";
import { getManagerDashboardData, getCashierDashboardData } from "../../services/dashboardServices";
import { useAuth } from "../../context/AuthContext";

export const useDashboardHandler = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(() => {
    // Load cached dashboard if available
    const cached = sessionStorage.getItem("dashboard");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!dashboard);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!user) return;

    // Skip fetch if data already exists
    if (dashboard) return;

    try {
      setLoading(true);
      setError(null);

      let data;
      if (user.role === "admin") {
        data = await getManagerDashboardData();
      } else if (user.role === "user") {
        data = await getCashierDashboardData();
      } else {
        throw new Error("Invalid role");
      }

      setDashboard(data);
      sessionStorage.setItem("dashboard", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, dashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};
