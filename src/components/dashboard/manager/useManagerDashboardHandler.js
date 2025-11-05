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

  // Non-selling products state
  const [selectedDays, setSelectedDays] = useState(30);
  const [nonSellingPage, setNonSellingPage] = useState(1);
  const [nonSelling, setNonSelling] = useState([]);
  const [hasMoreNonSelling, setHasMoreNonSelling] = useState(true);
  const [loadingNonSelling, setLoadingNonSelling] = useState(false);

  // Stock alerts state
  const [stockPage, setStockPage] = useState(1);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [hasMoreStock, setHasMoreStock] = useState(true);
  const [loadingStock, setLoadingStock] = useState(false);

  const nonSellingRef = useRef(null);
  const stockRef = useRef(null);

  // Initial dashboard data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getManagerDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch non-selling products with pagination & selectedDays
  useEffect(() => {
    (async () => {
      if (loadingNonSelling || (!hasMoreNonSelling && nonSellingPage > 1)) {
        return;
      }

      setLoadingNonSelling(true);
      try {
        const res = await getNonSellingProducts(nonSellingPage, selectedDays);
        
        setNonSelling(prev => 
          nonSellingPage === 1 ? res.data : [...prev, ...res.data]
        );
        
        setHasMoreNonSelling(res.meta.current_page < res.meta.last_page);
      } catch (error) {
        console.error("Error fetching non-selling products:", error);
        setHasMoreNonSelling(false);
      } finally {
        setLoadingNonSelling(false);
      }
    })();
  }, [nonSellingPage, selectedDays]);

  // Fetch stock alerts with pagination
  useEffect(() => {
    (async () => {
      if (loadingStock || (!hasMoreStock && stockPage > 1)) {
        return;
      }

      setLoadingStock(true);
      try {
        const res = await getLowStockAlerts(stockPage);
        
        setStockAlerts(prev => 
          stockPage === 1 ? res.data : [...prev, ...res.data]
        );
        
        setHasMoreStock(res.meta.current_page < res.meta.last_page);
      } catch (error) {
        console.error("Error fetching stock alerts:", error);
        setHasMoreStock(false);
      } finally {
        setLoadingStock(false);
      }
    })();
  }, [stockPage]);

  // Callbacks for infinite scroll
  const loadMoreNonSelling = useCallback(() => {
    if (!loadingNonSelling && hasMoreNonSelling) {
      setNonSellingPage(prev => prev + 1);
    }
  }, [loadingNonSelling, hasMoreNonSelling]);

  const loadMoreStock = useCallback(() => {
    if (!loadingStock && hasMoreStock) {
      setStockPage(prev => prev + 1);
    }
  }, [loadingStock, hasMoreStock]);

  // Infinite scroll for non-selling products
  useInfiniteScroll(
    nonSellingRef,
    loadMoreNonSelling,
    hasMoreNonSelling,
    loadingNonSelling
  );

  // Infinite scroll for stock alerts
  useInfiniteScroll(
    stockRef,
    loadMoreStock,
    hasMoreStock,
    loadingStock
  );

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
    nonSellingPage,
    loadingNonSelling,
    loadingStock,
    handleDaysChange,
  };
};