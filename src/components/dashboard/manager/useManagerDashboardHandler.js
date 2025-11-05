// ✅ Integration of useInfiniteScroll with best practices

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  getManagerDashboardData, 
  getNonSellingProducts,
  getLowStockAlerts 
} from "../../../services/dashboardServices";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

export const useManagerDashboardHandler = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);

  // Non-selling products pagination states
  const [nonSellingPage, setNonSellingPage] = useState(1);
  const [nonSelling, setNonSelling] = useState([]);
  const [hasMoreNonSelling, setHasMoreNonSelling] = useState(true);
  const [loadingNonSelling, setLoadingNonSelling] = useState(false);

  // Low stock products pagination states
  const [stockPage, setStockPage] = useState(1);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [hasMoreStock, setHasMoreStock] = useState(true);
  const [loadingStock, setLoadingStock] = useState(false);

  // Refs for sentinel and container for infinite scroll
  const nonSellingRef = useRef(null);
  const stockRef = useRef(null);
  const nonSellingContainerRef = useRef(null);
  const stockContainerRef = useRef(null);

  // Fetch main dashboard data on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getManagerDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch non-selling products on page or days change
  useEffect(() => {
    (async () => {
      if (loadingNonSelling || (!hasMoreNonSelling && nonSellingPage > 1)) return; // prevent double fetching
      setLoadingNonSelling(true);
      try {
        const res = await getNonSellingProducts(nonSellingPage, selectedDays);
        // Append or reset based on page
        setNonSelling(prev => nonSellingPage === 1 ? res.data : [...prev, ...res.data]);
        setHasMoreNonSelling(res.meta.current_page < res.meta.last_page);
      } catch (error) {
        console.error("Error fetching non-selling products:", error);
        setHasMoreNonSelling(false);
      } finally {
        setLoadingNonSelling(false);
      }
    })();
  }, [nonSellingPage, selectedDays]);

  // Fetch low stock products on page change
  useEffect(() => {
    (async () => {
      if (loadingStock || (!hasMoreStock && stockPage > 1)) return;
      setLoadingStock(true);
      try {
        const res = await getLowStockAlerts(stockPage);
        setStockAlerts(prev => stockPage === 1 ? res.data : [...prev, ...res.data]);
        setHasMoreStock(res.meta.current_page < res.meta.last_page);
      } catch (error) {
        console.error("Error fetching stock alerts:", error);
        setHasMoreStock(false);
      } finally {
        setLoadingStock(false);
      }
    })();
  }, [stockPage]);

  // Increment page for infinite scroll
  const loadMoreNonSelling = useCallback(() => {
    if (!loadingNonSelling && hasMoreNonSelling) setNonSellingPage(prev => prev + 1);
  }, [loadingNonSelling, hasMoreNonSelling]);

  const loadMoreStock = useCallback(() => {
    if (!loadingStock && hasMoreStock) setStockPage(prev => prev + 1);
  }, [loadingStock, hasMoreStock]);

  // ✅ Integrate useInfiniteScroll hooks at top level
  // - Always pass refs, load function, hasMore, loading state, and containerRef.current
  // - Observes sentinel and triggers loadMore when scrolled near bottom
  useInfiniteScroll(nonSellingRef, loadMoreNonSelling, hasMoreNonSelling, loadingNonSelling, nonSellingContainerRef.current);
  useInfiniteScroll(stockRef, loadMoreStock, hasMoreStock, loadingStock, stockContainerRef.current);

  // Handler for changing filter days
  const handleDaysChange = (days) => {
    setSelectedDays(days);
    setNonSellingPage(1);
    setNonSelling([]);
    setHasMoreNonSelling(true);
  };

  return {
    loading,
    dashboard,
    nonSelling,
    stockAlerts,
    selectedDays,
    nonSellingRef,
    stockRef,
    nonSellingContainerRef,
    stockContainerRef,
    loadingNonSelling,
    loadingStock,
    handleDaysChange,
  };
};

/*
✅ Key points explained:

1. Hooks must always be called at top level. No conditional calls.
2. Infinite scroll uses sentinelRef + containerRef to trigger loadMore.
3. loadMoreNonSelling and loadMoreStock increment pages when user scrolls to sentinel.
4. useEffect fetches new data whenever page or filters change.
5. hasMore flags prevent unnecessary API calls once last page is reached.
6. loading flags prevent double fetch while previous request is pending.
7. When days filter changes, reset page to 1 and clear previous items.
8. This setup ensures proper infinite scroll behavior with your Laravel pagination API.
*/
