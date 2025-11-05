import React from "react";
import {
  StatCard,
  SalesTrendChart,
  TopSellingProduct,
  NonSellingProductList,
  StockAlert,
} from "../index";
import { useManagerDashboardHandler } from "./useManagerDashboardHandler";

export default function ManagerDashboard() {
  // ✅ Destructure all state, refs, and handlers from the custom hook
  const {
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
  } = useManagerDashboardHandler();

  // ✅ Show loading state while dashboard is being fetched
  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  // ✅ Show error if no dashboard data is available
  if (!dashboard) {
    return <div className="p-6 text-red-500">No dashboard data available.</div>;
  }

  // ✅ Prepare stats array for StatCard components
  const stats = [
    {
      key: "totalSales",
      value: `₱${dashboard.total_sales?.current?.toLocaleString() ?? 0}`,
      percentageChange: dashboard.total_sales?.change_percentage ?? "0",
      isIncrease: parseFloat(dashboard.total_sales?.change_percentage || "0") >= 0,
    },
    {
      key: "totalItems",
      value: dashboard.total_items_sold?.current ?? 0,
      percentageChange: dashboard.total_items_sold?.change_percentage ?? "0",
      isIncrease: parseFloat(dashboard.total_items_sold?.change_percentage || "0") >= 0,
    },
    {
      key: "totalTransactions",
      value: dashboard.total_transactions?.current ?? 0,
      percentageChange: dashboard.total_transactions?.change_percentage ?? "0",
      isIncrease: parseFloat(dashboard.total_transactions?.change_percentage || "0") >= 0,
    },
    {
      key: "inventoryCount",
      value: dashboard.inventory_count?.current ?? 0,
      percentageChange: dashboard.inventory_count?.change_percentage ?? "0",
      isIncrease: parseFloat(dashboard.inventory_count?.change_percentage || "0") >= 0,
    },
    {
      key: "activeUsers",
      value: `${dashboard.active_users?.active_users ?? 0} / ${dashboard.active_users?.total_users ?? 0}`,
      percentageChange: "0",
      isIncrease: true,
    },
  ];

  return (
    <main className="flex flex-col">
      {/* ✅ Display all stat cards */}
      <div className="flex space-x-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            type={stat.key}
            value={stat.value}
            percentageChange={stat.percentageChange}
            isIncrease={stat.isIncrease}
          />
        ))}
      </div>

      {/* ✅ Main panels: left for charts, right for infinite scroll lists */}
      <section className="flex flex-wrap lg:flex-nowrap gap-4 mt-6">
        <div className="lg:w-3/5 w-full space-y-6">
          {/* ✅ Sales trend chart */}
          <SalesTrendChart title="Yearly Sales Trend" data={dashboard.sales_trend || []} />
          {/* ✅ Top selling products */}
          <TopSellingProduct title="Top-Selling Products" items={dashboard.top_products || []} />
        </div>

        <div className="lg:w-2/5 w-full flex flex-col space-y-4 h-[calc(100vh-200px)]">
          {/* ✅ Non-selling products with infinite scroll */}
          <NonSellingProductList
            items={nonSelling}                  // current loaded items
            selectedDays={selectedDays}        // filter by days
            onDaysChange={handleDaysChange}    // handler to reset page & items
            loading={loadingNonSelling}        // loading spinner state
            sentinelRef={nonSellingRef}        // element watched by intersection observer
            containerRef={nonSellingContainerRef} // scroll container for observer
          />

          {/* ✅ Low stock alerts with infinite scroll */}
          <StockAlert
            data={Array.isArray(stockAlerts) ? stockAlerts : []} // current loaded stock alerts
            loading={loadingStock}                                // loading spinner state
            sentinelRef={stockRef}                                // element watched by intersection observer
            containerRef={stockContainerRef}                     // scroll container for observer
          />
        </div>
      </section>
    </main>
  );
}

/*
✅ How it works after integration:

1. The custom hook `useManagerDashboardHandler` manages state, API calls, and pagination.
2. Infinite scroll triggers `loadMoreNonSelling` or `loadMoreStock` when the sentinel comes into view.
3. Sentinel elements (`nonSellingRef`, `stockRef`) are observed inside the scroll container (`containerRef`) by IntersectionObserver.
4. When scrolled near the bottom:
   - `loadMoreNonSelling` increments `nonSellingPage`, triggering useEffect to fetch next page.
   - `loadMoreStock` increments `stockPage`, triggering useEffect to fetch next page.
5. `hasMoreNonSelling` / `hasMoreStock` prevent fetching after last page.
6. `loadingNonSelling` / `loadingStock` prevent duplicate requests while one is in progress.
7. Changing `selectedDays` resets non-selling products: page=1, items=[], hasMore=true.
8. Stat cards, charts, and top-selling products are rendered from `dashboard` state.
9. Both NonSellingProductList and StockAlert now automatically fetch additional items when the user scrolls to the bottom.
10. All hooks are called at top-level, respecting React's Rules of Hooks.
*/
