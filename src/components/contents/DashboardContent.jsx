import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import StatCard from "../dashboard/StatCard";
import SalesTrendChart from "../dashboard/SalesTrendChart";
import TopProductsChart from "../dashboard/TopProductChart";
import ContentTitle from "../contents/ContentTitle";
import { getDashboardData } from "../../services/dashboardServices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardContent() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading dashboard</div>;
  if (!dashboard) return <div className="p-4">No data available</div>;

  // Metrics
  const metrics = [
    {
      title: "Total Sales",
      value: `₱${dashboard.total_sales?.current.toLocaleString() ?? 0}`,
      change: Number(dashboard.total_sales?.change_percentage?.replace("%", "") ?? 0),
      icon: "💵",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Transactions",
      value: dashboard.total_transactions?.current ?? 0,
      change: Number(dashboard.total_transactions?.change_percentage?.replace("%", "") ?? 0),
      icon: "🛒",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Products",
      value: dashboard.total_products?.current ?? 0,
      change: Number(dashboard.total_products?.change_percentage?.replace("%", "") ?? 0),
      icon: "📦",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Users",
      value: dashboard.active_users?.current ?? 0,
      change: Number(dashboard.active_users?.change_percentage?.replace("%", "") ?? 0),
      icon: "👤",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // Charts data
  const salesTrendData = {
    labels: dashboard.sales_trend?.map(item => item.month) ?? [],
    data: dashboard.sales_trend?.map(item => item.total_sales) ?? [],
  };

  const topProductsData = {
    labels: dashboard.top_products?.map(item => item.product_name) ?? [],
    data: dashboard.top_products?.map(item => item.total_sold) ?? [],
  };

  // Lists
  const recentTransactions = dashboard.recent_transactions?.map(tx => ({
    name: tx.user,
    items: tx.products.length,
    time: tx.date,
    amount: `₱${Number(tx.total_amount).toLocaleString()}`,
  })) ?? [];

  const lowStockItems = dashboard.low_stock?.map(item => ({
    name: item.product_name,
    units: item.stock,
    severity: item.status === "Out of Stock" ? "Critical" : "Low",
  })) ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded shadow">
      <ContentTitle Title="Dashboard" />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <StatCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow h-64">
            <h3 className="font-bold mb-4">Sales Trend</h3>
            <SalesTrendChart salesTrend={salesTrendData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow h-64">
            <h3 className="font-bold mb-4">Top Products</h3>
            <TopProductsChart topProducts={topProductsData} />
          </div>
        </div>

        {/* Bottom Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Transactions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">Recent Transactions</h3>
            <ul className="space-y-3">
              {recentTransactions.map((tx, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{tx.name}</span>
                    <span className="text-gray-500"> ({tx.items} items · {tx.time})</span>
                  </div>
                  <span className="text-green-500 font-semibold">{tx.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Low Stock */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">Low Stock Alert</h3>
            <ul className="space-y-3">
              {lowStockItems.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{item.name} - {item.units} units remaining</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.severity === "Critical" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {item.severity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
