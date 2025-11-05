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
// Main Dashboard
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
    inventoryRef,
    inventorySearch,
    setInventorySearch,
    timeLogs,
    timeLogsMeta,
    loadingTimeLogs,
    loadMoreTimeLogs,
    timeLogsRef,
    setTimeLogsDateFilter,
    salesLogs,
    salesLogsMeta,
    loadingSalesLogs,
    loadMoreSalesLogs,
    salesLogsRef,
    setSalesLogsDateFilter,
  } = useCashierDashboard();


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
      percentageChange: Math.abs(
        parseFloat(dashboardData.data.total_sales?.change_percentage) || 0
      ),
      isIncrease: !dashboardData.data.total_sales?.change_percentage?.includes("-"),
    },
    {
      key: "totalItems",
      value: dashboardData.data.total_items_sold?.current || 0,
      percentageChange: Math.abs(
        parseFloat(dashboardData.data.total_items_sold?.change_percentage) || 0
      ),
      isIncrease: !dashboardData.data.total_items_sold?.change_percentage?.includes("-"),
    },
    {
      key: "totalTransactions",
      value: dashboardData.data.total_transactions?.current || 0,
      percentageChange: Math.abs(
        parseFloat(dashboardData.data.total_transactions?.change_percentage) || 0
      ),
      isIncrease: !dashboardData.data.total_transactions?.change_percentage?.includes("-"),
    },
    {
      key: "totalLogs",
      value: formatHours(dashboardData.data.total_logged_hours),
      percentageChange: 0,
      isIncrease: true,
    },
  ];

  console.log(dashboardData)
  console.log(dashboardData.data.total_logged_hours)

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
            searchTerm={inventorySearch}
            setSearchTerm={setInventorySearch}
          />
        </div>

        <div className="w-full lg:w-2/5 flex flex-col min-h-0">
          <RecordPanel
            timeLogs={timeLogs}
            timeLogsMeta={timeLogsMeta}
            loadingTimeLogs={loadingTimeLogs}
            loadMoreTimeLogs={loadMoreTimeLogs}
            timeLogsRef={timeLogsRef}
            setTimeLogsDateFilter={setTimeLogsDateFilter}
            salesLogs={salesLogs}
            salesLogsMeta={salesLogsMeta}
            loadingSalesLogs={loadingSalesLogs}
            loadMoreSalesLogs={loadMoreSalesLogs}
            salesLogsRef={salesLogsRef}
            setSalesLogsDateFilter={setSalesLogsDateFilter}
          />
        </div>
      </section>
    </main>
  );
}

export default memo(CashierDashboard);
