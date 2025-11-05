import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCashierDashboardData,
  getCashierInventory,
  getCashierTimeLogs,
  getCashierSalesLogs,
} from "../../../services/dashboardServices";

// ------------------------------
// Main Hook
// ------------------------------
export const useCashierDashboard = () => {
  // ---------- Dashboard ----------
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Inventory ----------
  const [inventory, setInventory] = useState([]);
  const [inventoryMeta, setInventoryMeta] = useState({});
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventorySearch, setInventorySearch] = useState(""); // optional still if needed
  const inventoryRef = useRef(null);

  // ---------- Time Logs ----------
  const [timeLogs, setTimeLogs] = useState([]);
  const [timeLogsMeta, setTimeLogsMeta] = useState({});
  const [loadingTimeLogs, setLoadingTimeLogs] = useState(false);
  const [timeLogsPage, setTimeLogsPage] = useState(1);
  const [timeLogsDateFilter, setTimeLogsDateFilter] = useState(""); // <-- date filter
  const timeLogsRef = useRef(null);

  // ---------- Sales Logs ----------
  const [salesLogs, setSalesLogs] = useState([]);
  const [salesLogsMeta, setSalesLogsMeta] = useState({});
  const [loadingSalesLogs, setLoadingSalesLogs] = useState(false);
  const [salesLogsPage, setSalesLogsPage] = useState(1);
  const [salesLogsDateFilter, setSalesLogsDateFilter] = useState(""); // <-- date filter
  const salesLogsRef = useRef(null);

  // ------------------------------
  // Fetchers
  // ------------------------------
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const data = await getCashierDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const fetchInventory = useCallback(
    async (page, search = "") => {
      if (loadingInventory) return;
      setLoadingInventory(true);
      try {
        const res = await getCashierInventory(page, search);
        setInventory(page === 1 ? res.data : [...inventory, ...res.data]);
        setInventoryMeta(res.meta);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingInventory(false);
      }
    },
    [loadingInventory, inventory]
  );

  const fetchTimeLogs = useCallback(
    async (page, date = "") => {
      if (loadingTimeLogs) return;
      setLoadingTimeLogs(true);
      try {
        const res = await getCashierTimeLogs(page, date);
        setTimeLogs(page === 1 ? res.data : [...timeLogs, ...res.data]);
        setTimeLogsMeta(res.meta);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingTimeLogs(false);
      }
    },
    [loadingTimeLogs, timeLogs]
  );

  const fetchSalesLogs = useCallback(
    async (page, date = "") => {
      if (loadingSalesLogs) return;
      setLoadingSalesLogs(true);
      try {
        const res = await getCashierSalesLogs(page, date);
        setSalesLogs(page === 1 ? res.data : [...salesLogs, ...res.data]);
        setSalesLogsMeta(res.meta);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingSalesLogs(false);
      }
    },
    [loadingSalesLogs, salesLogs]
  );

  // ------------------------------
  // Load More Functions
  // ------------------------------
  const loadMoreInventory = useCallback(() => {
    if (loadingInventory) return;
    if (inventoryMeta?.current_page < inventoryMeta?.last_page) {
      setInventoryPage(prev => prev + 1);
    }
  }, [inventoryMeta, loadingInventory]);

  const loadMoreTimeLogs = useCallback(() => {
    if (loadingTimeLogs) return;
    if (timeLogsMeta?.current_page < timeLogsMeta?.last_page) {
      setTimeLogsPage(prev => prev + 1);
    }
  }, [timeLogsMeta, loadingTimeLogs]);

  const loadMoreSalesLogs = useCallback(() => {
    if (loadingSalesLogs) return;
    if (salesLogsMeta?.current_page < salesLogsMeta?.last_page) {
      setSalesLogsPage(prev => prev + 1);
    }
  }, [salesLogsMeta, loadingSalesLogs]);

  // ------------------------------
  // Effects
  // ------------------------------
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Inventory effect (optional)
  useEffect(() => {
    fetchInventory(1, inventorySearch);
  }, [inventorySearch]);

  // Time Logs effect: refetch on date filter or page change
  useEffect(() => {
    setTimeLogsPage(1);
    setTimeLogs([]);
    fetchTimeLogs(1, timeLogsDateFilter);
  }, [timeLogsDateFilter]);

  useEffect(() => {
    if (timeLogsPage === 1) return;
    fetchTimeLogs(timeLogsPage, timeLogsDateFilter);
  }, [timeLogsPage]);

  // Sales Logs effect: refetch on date filter or page change
  useEffect(() => {
    setSalesLogsPage(1);
    setSalesLogs([]);
    fetchSalesLogs(1, salesLogsDateFilter);
  }, [salesLogsDateFilter]);

  useEffect(() => {
    if (salesLogsPage === 1) return;
    fetchSalesLogs(salesLogsPage, salesLogsDateFilter);
  }, [salesLogsPage]);

  // ------------------------------
  // Return
  // ------------------------------
  return {
    dashboardData,
    loadingDashboard,
    error,

    inventory,
    inventoryMeta,
    loadingInventory,
    loadMoreInventory,
    inventoryRef,
    inventorySearch,
    setInventorySearch,

    timeLogs,
    timeLogsMeta,
    loadingTimeLogs,
    loadMoreTimeLogs,
    timeLogsRef,
    timeLogsDateFilter,
    setTimeLogsDateFilter, // <-- expose setter for calendar

    salesLogs,
    salesLogsMeta,
    loadingSalesLogs,
    loadMoreSalesLogs,
    salesLogsRef,
    salesLogsDateFilter,
    setSalesLogsDateFilter, // <-- expose setter for calendar
  };
};
