import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboardServices";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboard(data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { dashboard, loading, error };
}
