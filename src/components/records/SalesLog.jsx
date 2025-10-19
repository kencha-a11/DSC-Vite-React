// src/components/records/SalesLog.jsx
import React, { useEffect, useState } from "react";
import { getSalesLogs } from "../../services/logServices";

export default function SalesLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch sales logs from API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        user_id: userFilter || undefined,
        date: dateFilter || undefined,
      };
      const data = await getSalesLogs(params);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch sales logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userFilter, dateFilter]);

  // Filter by search text
  const filteredLogs = logs.filter((log) =>
    log.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Extract unique users for filter dropdown
  const uniqueUsers = Array.from(new Map(logs.map((l) => [l.user?.id, l.user])).values());

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* Section A */}
      <div className="p-4 border-b space-y-4">
        {/* Upper Part */}
        <div className="text-2xl font-bold text-gray-800">Sales Log</div>

        {/* Middle Part: Filters */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by User</option>
            {uniqueUsers.map((user, idx) => (
              <option key={`filter-user-${user?.id ?? idx}`} value={user?.id}>
                {user?.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lower Part: Column Headers */}
        <div className="grid grid-cols-2 text-gray-500 font-semibold text-sm">
          <div>Details</div>
          <div className="grid grid-cols-3 text-center">
            <span>Item</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>
        </div>
      </div>

      {/* Section B: Sales Logs */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {loading && <p>Loading...</p>}
        {!loading && filteredLogs.length === 0 && <p>No sales logs found</p>}

        {!loading &&
          filteredLogs.map((log, index) => {
            const saleItems = log.sale_items ?? [];
            const saleDate = new Date(log.created_at ?? Date.now());

            const totalItems = saleItems.reduce((acc, item) => acc + (item.quantity ?? 0), 0);
            const totalPrice = saleItems.reduce((acc, item) => acc + parseFloat(item.subtotal ?? 0), 0);

            return (
              <div
                key={`sale-${log.id ?? 'no-id'}-${log.user?.id ?? 'no-user'}-${saleDate.getTime()}-${index}`}
                className="flex border rounded-lg p-3 hover:bg-gray-50"
              >
                {/* Left Section: User Info & Totals */}
                <div className="flex flex-col w-1/3 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={log.user?.avatar || "https://via.placeholder.com/40"}
                      alt={log.user?.name ?? "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col text-gray-600">
                      <span className="font-medium">{log.user?.name}</span>
                      <span className="text-sm">
                        {saleDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-sm">
                        {saleDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col mt-2 text-gray-700 font-semibold">
                    <span>{totalItems} Items</span>
                    <span>Total: ${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Right Section: Sale Items */}
                <div className="flex-1 grid grid-cols-3 text-center gap-2">
                  {saleItems.map((item, itemIndex) => (
                    <React.Fragment
                      key={`sale-${log.id ?? index}-item-${item.id ?? itemIndex}-${item.product?.id ?? 'no-prod'}`}
                    >
                      <div>{item.product?.name ?? "N/A"}</div>
                      <div>{item.quantity ?? 0}</div>
                      <div>${parseFloat(item.subtotal ?? 0).toFixed(2)}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
