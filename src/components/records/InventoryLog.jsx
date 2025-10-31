// src/components/records/InventoryLog.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getInventoryLogs } from "../../services/logServices";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function InventoryLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef();
  const debouncedSearch = useDebounce(search, 400);

  // Fetch logs with pagination
  const fetchLogs = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const params = {
          product_id: productFilter || undefined,
          date: dateFilter || undefined,
          page: pageToFetch,
          limit: 20, // adjust as needed
        };
        const data = await getInventoryLogs(params);
        setLogs(prev => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(data.length > 0);
      } catch (err) {
        console.error("Failed to fetch inventory logs:", err);
        setLogs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [productFilter, dateFilter]
  );

  // Reset logs when filters/search change
  useEffect(() => {
    setLogs([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, productFilter, dateFilter]);

  // Fetch logs when page changes
  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  // Infinite scroll
  useInfiniteScroll(
    loaderRef,
    () => {
      if (hasMore && !loading) setPage(prev => prev + 1);
    },
    hasMore,
    loading
  );

  // Filter logs client-side by search
  const filteredLogs = logs.filter(log =>
    (log.product?.name ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const uniqueProducts = Array.from(
    new Map(
      logs
        .filter((l) => l.product?.id && l.product?.name)
        .map((l) => [l.product.id, { id: l.product.id, name: l.product.name }])
    ).values()
  );

  const getActionColor = (action) => {
    const a = (action ?? "").toLowerCase();
    switch (a) {
      case "created":
        return "text-green-600 font-semibold";
      case "update":
        return "text-blue-600 font-semibold";
      case "restock":
        return "text-emerald-600 font-semibold";
      case "deducted":
        return "text-orange-500 font-semibold";
      case "deleted":
        return "text-red-600 font-semibold";
      case "adjusted":
        return "text-gray-600 font-semibold";
      default:
        return "text-gray-700";
    }
  };

  const formatActionLabel = (action) => {
    const map = {
      created: "Added",
      update: "Updated",
      restock: "Restocked",
      deducted: "Deducted",
      deleted: "Removed",
      adjusted: "Adjusted",
    };
    return map[action?.toLowerCase()] ?? action ?? "N/A";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* Filters */}
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center w-full">
          <input
            type="text"
            placeholder="Search by product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 min-w-[250px] p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-1 gap-4">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="flex-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filter by Product</option>
              {uniqueProducts.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_0.5fr_0.5fr] items-center text-gray-600 font-medium text-sm border-y border-gray-200 bg-gray-100 py-3 px-8 select-none">
        <div className="text-left">Action</div>
        <div className="text-left">Quantity</div>
        <div className="text-left">Product</div>
        <div className="text-right">Date & Time</div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-auto">
        {!loading && filteredLogs.length === 0 && (
          <p className="py-6 text-center text-gray-500">No inventory logs found</p>
        )}

        {filteredLogs.map((log, index) => {
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
              key={log.id || index}
              className="grid grid-cols-[1fr_1fr_0.5fr_0.5fr] border-t border-gray-200 hover:bg-gray-50 px-8 py-6"
            >
              <div className="flex flex-col">
                <span className={`capitalize ${getActionColor(log.action)}`}>
                  {formatActionLabel(log.action)}
                </span>
              </div>
              <div className="flex items-center text-gray-800 text-sm">
                {log.quantity_change ?? "-"}
              </div>
              <div className="flex items-center text-gray-800 text-sm">
                {log.product?.name ?? "N/A"}
              </div>
              <div className="flex flex-col items-end text-gray-700 text-sm">
                <div>{formattedDate}</div>
                <div className="text-xs text-gray-500">{formattedTime}</div>
              </div>
            </div>
          );
        })}

        {loading && <p className="py-6 text-center text-gray-500">Loading...</p>}
        <div ref={loaderRef} className="h-10"></div>
      </div>
    </div>
  );
}
