// src/components/records/SalesLog.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getSalesLogs } from "../../services/logServices";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function SalesLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
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
          user_id: userFilter || undefined,
          date: dateFilter || undefined,
          page: pageToFetch,
          limit: 20, // adjust limit as needed
        };
        const data = await getSalesLogs(params);

        setLogs(prev => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(data.length > 0);
      } catch (err) {
        console.error("Failed to fetch sales logs:", err);
        setLogs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [userFilter, dateFilter]
  );

  // Reset logs when filters/search change
  useEffect(() => {
    setLogs([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, userFilter, dateFilter]);

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

  // Filter logs client-side for search
  const filteredLogs = logs.filter(log =>
    (log.user?.name ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const uniqueUsers = Array.from(
    new Map(logs.map(l => [l.user?.id, l.user])).values()
  ).sort((a, b) => (a?.name ?? "").localeCompare(b?.name ?? ""));

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* Filters */}
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center w-full">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 min-w-[250px] p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-1 gap-4">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="flex-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filter by User</option>
              {uniqueUsers.map(user => (
                <option key={user?.id} value={user?.id}>{user?.name}</option>
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

      {/* Header Row */}
      <div className="grid grid-cols-[1fr_1fr_0.5fr_0.5fr] items-center text-gray-600 font-medium text-sm border-y border-gray-200 bg-gray-100 py-3 px-8 select-none pr-14">
        <div className="text-left">Details</div>
        <div className="text-left">Item Name</div>
        <div className="text-left">Quantity</div>
        <div className="text-right">Subtotal</div>
      </div>

      {/* Sales Logs */}
      <div className="flex-1 overflow-auto">
        {filteredLogs.map((log, index) => {
          const saleItems = log.sale_items ?? [];
          const saleDate = new Date(log.created_at ?? Date.now());
          const totalItems = saleItems.reduce(
            (acc, item) => acc + (item.quantity ?? item.snapshot_quantity ?? 0),
            0
          );
          const totalPrice = saleItems.reduce(
            (acc, item) => acc + parseFloat(item.subtotal ?? 0),
            0
          );

          return (
            <div
              key={`sale-${log.id ?? index}`}
              className="grid grid-cols-[1fr_1fr_0.5fr_0.5fr] border-t border-gray-200 hover:bg-gray-50 px-8 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-500 text-white font-semibold text-lg uppercase">
                  {log.user?.name ? log.user.name.charAt(0) : "?"}
                </div>

                <div className="flex flex-col text-gray-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{log.user?.name ?? "Unknown User"}</span>
                    <span className="text-gray-500 text-sm">
                      {saleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {saleDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{totalItems} items</div>
                  <div className="text-green-600 font-semibold text-sm">Total: ₱{totalPrice.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex flex-col justify-start text-gray-700 text-sm">
                {saleItems.map((item, i) => (
                  <div key={`item-name-${i}`} className="leading-6">
                    {item.product?.name ?? item.snapshot_name ?? "Deleted Product"}
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-start text-gray-700 text-sm">
                {saleItems.map((item, i) => (
                  <div key={`item-qty-${i}`} className="leading-6">
                    {item.quantity ?? item.snapshot_quantity ?? 0}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-end text-gray-700 text-sm pr-4">
                {saleItems.map((item, i) => (
                  <div key={`item-sub-${i}`} className="leading-6">
                    ₱{parseFloat(item.subtotal ?? 0).toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}
        <div ref={loaderRef} className="h-10"></div>
      </div>
    </div>
  );
}
