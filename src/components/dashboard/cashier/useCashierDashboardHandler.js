import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCashierDashboardData,
  getCashierInventory,
  getCashierTimeLogs,
  getCashierSalesLogs,
} from "../../../services/dashboardServices";

import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

export const useCashierDashboard = () => {
  // Dashboard state
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [inventoryMeta, setInventoryMeta] = useState({});
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventorySearch, setInventorySearch] = useState("");
  const inventoryRef = useRef(null);
  const inventorySentinelRef = useRef(null);

  // Time Logs state
  const [timeLogs, setTimeLogs] = useState([]);
  const [timeLogsMeta, setTimeLogsMeta] = useState({});
  const [loadingTimeLogs, setLoadingTimeLogs] = useState(false);
  const [timeLogsPage, setTimeLogsPage] = useState(1);
  const [timeLogsDateFilter, setTimeLogsDateFilter] = useState("");
  const timeLogsRef = useRef(null);
  const timeLogsSentinelRef = useRef(null);

  // Sales Logs state
  const [salesLogs, setSalesLogs] = useState([]);
  const [salesLogsMeta, setSalesLogsMeta] = useState({});
  const [loadingSalesLogs, setLoadingSalesLogs] = useState(false);
  const [salesLogsPage, setSalesLogsPage] = useState(1);
  const [salesLogsDateFilter, setSalesLogsDateFilter] = useState("");
  const salesLogsRef = useRef(null);
  const salesLogsSentinelRef = useRef(null);

  // Fetch dashboard data
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

  // Fetch inventory
  const fetchInventory = useCallback(async (page, search = "") => {
    setLoadingInventory(true);
    try {
      const res = await getCashierInventory(page, search);
      setInventory((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setInventoryMeta(res.meta);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingInventory(false);
    }
  }, []);

  // Fetch time logs
  const fetchTimeLogs = useCallback(async (page, date = "") => {
    setLoadingTimeLogs(true);
    try {
      const res = await getCashierTimeLogs(page, date);
      setTimeLogs((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setTimeLogsMeta(res.meta);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingTimeLogs(false);
    }
  }, []);

  // Fetch sales logs
  const fetchSalesLogs = useCallback(async (page, date = "") => {
    setLoadingSalesLogs(true);
    try {
      const res = await getCashierSalesLogs(page, date);
      setSalesLogs((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setSalesLogsMeta(res.meta);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingSalesLogs(false);
    }
  }, []);

  // Load more handlers
  const loadMoreInventory = useCallback(() => {
    if (inventoryMeta?.current_page < inventoryMeta?.last_page) {
      setInventoryPage((prev) => prev + 1);
    }
  }, [inventoryMeta]);

  const loadMoreTimeLogs = useCallback(() => {
    if (timeLogsMeta?.current_page < timeLogsMeta?.last_page) {
      setTimeLogsPage((prev) => prev + 1);
    }
  }, [timeLogsMeta]);

  const loadMoreSalesLogs = useCallback(() => {
    if (salesLogsMeta?.current_page < salesLogsMeta?.last_page) {
      setSalesLogsPage((prev) => prev + 1);
    }
  }, [salesLogsMeta]);

  // Infinite scroll setup
  useInfiniteScroll(
    inventorySentinelRef,
    loadMoreInventory,
    inventoryPage < (inventoryMeta?.last_page || 0),
    loadingInventory,
    inventoryRef
  );

  useInfiniteScroll(
    timeLogsSentinelRef,
    loadMoreTimeLogs,
    timeLogsPage < (timeLogsMeta?.last_page || 0),
    loadingTimeLogs,
    timeLogsRef
  );

  useInfiniteScroll(
    salesLogsSentinelRef,
    loadMoreSalesLogs,
    salesLogsPage < (salesLogsMeta?.last_page || 0),
    loadingSalesLogs,
    salesLogsRef
  );

  // Initial dashboard data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Inventory effects
  useEffect(() => {
    setInventoryPage(1);
    setInventory([]);
    fetchInventory(1, inventorySearch);
  }, [inventorySearch, fetchInventory]);

  useEffect(() => {
    if (inventoryPage > 1) {
      fetchInventory(inventoryPage, inventorySearch);
    }
  }, [inventoryPage]); // Intentionally minimal deps to prevent loops

  // Time logs effects
  useEffect(() => {
    setTimeLogsPage(1);
    setTimeLogs([]);
    fetchTimeLogs(1, timeLogsDateFilter);
  }, [timeLogsDateFilter, fetchTimeLogs]);

  useEffect(() => {
    if (timeLogsPage > 1) {
      fetchTimeLogs(timeLogsPage, timeLogsDateFilter);
    }
  }, [timeLogsPage]); // Intentionally minimal deps

  // Sales logs effects
  useEffect(() => {
    setSalesLogsPage(1);
    setSalesLogs([]);
    fetchSalesLogs(1, salesLogsDateFilter);
  }, [salesLogsDateFilter, fetchSalesLogs]);

  useEffect(() => {
    if (salesLogsPage > 1) {
      fetchSalesLogs(salesLogsPage, salesLogsDateFilter);
    }
  }, [salesLogsPage]); // Intentionally minimal deps

  return {
    dashboardData,
    loadingDashboard,
    error,
    inventory,
    inventoryMeta,
    loadingInventory,
    inventoryRef,
    inventorySentinelRef,
    loadMoreInventory,
    inventorySearch,
    setInventorySearch,
    
    timeLogs,
    timeLogsMeta,
    loadingTimeLogs,
    timeLogsRef,
    timeLogsSentinelRef,
    loadMoreTimeLogs,
    timeLogsDateFilter,
    setTimeLogsDateFilter,

    salesLogs,
    salesLogsMeta,
    loadingSalesLogs,
    salesLogsRef,
    salesLogsSentinelRef,
    loadMoreSalesLogs,
    salesLogsDateFilter,
    setSalesLogsDateFilter,
  };
};