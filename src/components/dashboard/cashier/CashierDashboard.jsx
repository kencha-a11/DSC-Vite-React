// ===== FILE: CashierDashboard.jsx =====
import React, { memo } from "react";
import StatCard from "../StatCard";
import { InventoryTable } from "./InventoryTable";
import RecordPanel from "./RecordPanel";
import { useCashierDashboard } from "./useCashierDashboardHandler";

// Helper to format hours nicely
const formatHours = (hours) => {
  if (hours == null) return "0h"; // handle null or undefined
  const totalMinutes = Math.round(Math.abs(hours) * 60); // convert negative to positive
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ==============================
// Main Dashboard Component
// ==============================
function CashierDashboard() {
  const {
    dashboardData,
    loadingDashboard,
    error,
    inventory,
    inventoryMeta,
    loadingInventory,
    loadMoreInventory,
    inventoryRef,        // ✅ scroll container ref for InventoryTable
    inventorySentinelRef, // ✅ sentinel ref for inventory infinite scroll
    inventorySearch,
    setInventorySearch,
    timeLogs,
    timeLogsMeta,
    loadingTimeLogs,
    loadMoreTimeLogs,
    timeLogsRef,
    timeLogsSentinelRef, // ✅ sentinel ref for timeLogs infinite scroll
    setTimeLogsDateFilter,
    salesLogs,
    salesLogsMeta,
    loadingSalesLogs,
    loadMoreSalesLogs,
    salesLogsRef,
    salesLogsSentinelRef, // ✅ sentinel ref for salesLogs infinite scroll
    setSalesLogsDateFilter,
  } = useCashierDashboard();

  console.log(dashboardData)

  // ✅ Early returns for loading and error states
  if (loadingDashboard) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error?.message}</div>;
  if (!dashboardData || !dashboardData.data) return <div>No dashboard data</div>;

  // ==============================
  // Prepare stat cards safely
  // ==============================
  const stats = [
    {
      key: "totalSales",
      value: `₱ ${dashboardData.data.total_sales?.current?.toLocaleString() || 0}`,
      percentageChange: Math.abs(parseFloat(dashboardData.data.total_sales?.change_percentage) || 0),
      isIncrease: !dashboardData.data.total_sales?.change_percentage?.includes("-"),
    },
    {
      key: "totalItems",
      value: dashboardData.data.total_items_sold?.current || 0,
      percentageChange: Math.abs(parseFloat(dashboardData.data.total_items_sold?.change_percentage) || 0),
      isIncrease: !dashboardData.data.total_items_sold?.change_percentage?.includes("-"),
    },
    {
      key: "totalTransactions",
      value: dashboardData.data.total_transactions?.current || 0,
      percentageChange: Math.abs(parseFloat(dashboardData.data.total_transactions?.change_percentage) || 0),
      isIncrease: !dashboardData.data.total_transactions?.change_percentage?.includes("-"),
    },
    {
      key: "totalLogs",
      value: formatHours(dashboardData.data.total_logged_hours),
      percentageChange: 0,
      isIncrease: true,
    },
  ];

  // ==============================
  // Main return rendering
  // ==============================
  return (
    <main className="flex flex-col space-y-4 h-full overflow-hidden">
      {/* ==== Stats Cards ==== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            type={stat.key}
            value={stat.value}
            percentageChange={stat.percentageChange}
            isIncrease={stat.isIncrease}
          />
        ))}
      </section>

      {/* ==== Main Panels ==== */}
      <section className="w-full flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="w-full lg:w-3/5 flex flex-col min-h-0">
          <InventoryTable
            data={inventory}                   
            loading={loadingInventory}         
            meta={inventoryMeta}               
            loadMore={loadMoreInventory}       
            scrollRef={inventoryRef}           
            sentinelRef={inventorySentinelRef} // ✅ pass sentinel to child for infinite scroll
            searchTerm={inventorySearch}       
            setSearchTerm={setInventorySearch} 
          />
          {/* ✅ Infinite scroll works because IntersectionObserver observes sentinel inside scrollRef */}
        </div>

        <div className="w-full lg:w-2/5 flex flex-col min-h-0">
          <RecordPanel
            timeLogs={timeLogs}
            timeLogsMeta={timeLogsMeta}
            loadingTimeLogs={loadingTimeLogs}
            loadMoreTimeLogs={loadMoreTimeLogs}         
            scrollRef={timeLogsRef}           
            sentinelRef={timeLogsSentinelRef}  // ✅ attach sentinel for timeLogs
            setTimeLogsDateFilter={setTimeLogsDateFilter}
            
            salesLogs={salesLogs}
            salesLogsMeta={salesLogsMeta}
            loadingSalesLogs={loadingSalesLogs}
            loadMoreSalesLogs={loadMoreSalesLogs} 
            salesLogsRef={salesLogsRef}           
            sentinelRefSales={salesLogsSentinelRef} // ✅ attach sentinel for salesLogs
            setSalesLogsDateFilter={setSalesLogsDateFilter}
          />
          {/* ✅ Infinite scroll for both timeLogs and salesLogs handled via sentinels */}
        </div>
      </section>
    </main>
  );
}

export default memo(CashierDashboard);

/*
✅ Key Infinite Scroll Notes:

1. inventoryRef, timeLogsRef, salesLogsRef provide scrollable container refs for IntersectionObserver root.
2. inventorySentinelRef, timeLogsSentinelRef, salesLogsSentinelRef provide the sentinel element observed at the bottom of the list.
3. loadMoreInventory, loadMoreTimeLogs, loadMoreSalesLogs are callbacks that increment page number and trigger fetchers.
4. Child components (InventoryTable, RecordPanel) render sentinel divs at the end of the list and attach the refs.
5. IntersectionObserver in useInfiniteScroll hook watches sentinel relative to scroll container:
   - triggers loadMore only when sentinel is visible, hasMore is true, and not currently loading.
6. min-h-0 + flex-1 on scrollable divs ensures the container can properly scroll for IntersectionObserver to work.
7. Using memo prevents unnecessary re-renders that could disconnect the observers.
8. All infinite scroll logic is centralized in useCashierDashboard hook; child components only receive data, refs, and handlers.
*/
