import React, { useEffect, useState } from "react";
import { getInventoryLogs } from "../../services/logServices";

export default function InventoryLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch inventory logs from API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        product_id: productFilter || undefined,
        date: dateFilter || undefined,
      };
      const data = await getInventoryLogs(params);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch inventory logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [productFilter, dateFilter]);

  // ✅ Filter by search (match user name or product name)
  const filteredLogs = logs.filter((log) => {
    const productName = log.product?.name?.toLowerCase() || "";
    const userName = log.user?.name?.toLowerCase() || "";
    return (
      productName.includes(search.toLowerCase()) ||
      userName.includes(search.toLowerCase())
    );
  });

  // ✅ Extract unique product names for dropdown
  const uniqueProducts = Array.from(
    new Set(logs.map((l) => l.product?.name))
  ).filter(Boolean);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4">
      {/* Title */}
      <div className="text-xl font-bold text-gray-800 mb-4">Inventory log</div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by user or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by product</option>
          {uniqueProducts.map((prod, idx) => (
            <option key={idx} value={prod}>
              {prod}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-2 text-sm">
        <span>Action</span>
        <span className="text-center">Quantity Change</span>
        <span className="text-center">Product</span>
        <span className="text-right">Date and Time</span>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {loading && <p className="py-4 text-gray-500 text-center">Loading...</p>}
        {!loading && filteredLogs.length === 0 && (
          <p className="py-4 text-gray-500 text-center">No inventory logs found</p>
        )}

        {!loading &&
          filteredLogs.map((log, index) => {
            const date = new Date(log.created_at);
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            const formattedTime = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={index}
                className="grid grid-cols-4 py-3 text-gray-700 items-center hover:bg-gray-50 rounded-lg"
              >
                {/* Action + User */}
                <div className="flex flex-col">
                  <span className="font-medium capitalize">{log.action}</span>
                  <span className="text-sm text-gray-500">
                    by {log.user?.name ?? "Unknown"}
                  </span>
                </div>

                {/* Quantity */}
                <div className="text-center">{log.quantity_change ?? "-"}</div>

                {/* Product */}
                <div className="text-center">{log.product?.name ?? "N/A"}</div>

                {/* Date */}
                <div className="text-right text-sm text-gray-600">
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
