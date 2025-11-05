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
  const {
    loading,
    dashboard,
    nonSelling,
    stockAlerts,
    nonSellingRef,
    stockRef,
    selectedDays,
    handleDaysChange,
    nonSellingPage,
  } = useManagerDashboardHandler();

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-6 text-red-500">No dashboard data available.</div>;
  }

  // Map backend data to StatCard props
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
    <main>
      {/* Stats cards */}
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

      {/* Main panels */}
      <section className="flex flex-wrap lg:flex-nowrap gap-4 mt-6">
        <div className="lg:w-3/5 w-full space-y-6">
          <SalesTrendChart
            title="Yearly Sales Trend"
            data={dashboard.sales_trend || []}
          />
          <TopSellingProduct
            title="Top-Selling Products"
            items={dashboard.top_products || []}
          />
        </div>

        <div className="lg:w-2/5 w-full flex flex-col space-y-4">
          {/* Scrollable Non-Selling Products */}
          <NonSellingProductList
            items={Array.isArray(nonSelling) ? nonSelling : []}
            selectedDays={selectedDays}
            onDaysChange={handleDaysChange}
            ref={nonSellingRef}
            page={nonSellingPage}
          />

          {/* Scrollable Stock Alert */}
          <StockAlert 
            data={Array.isArray(stockAlerts) ? stockAlerts : []} 
            ref={stockRef}
          />
        </div>
      </section>
    </main>
  );
}