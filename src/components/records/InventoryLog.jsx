import React, { useEffect, useState, useRef, useCallback } from "react";
import { getInventoryLogs } from "../../services/logServices";

// Simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Simple infinite scroll hook
function useInfiniteScroll(loaderRef, callback, hasMore, loading) {
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, callback, hasMore, loading]);
}

export default function InventoryLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef();
  const debouncedSearch = useDebounce(search, 400);

  // No highlighting - just return text as-is
  const highlightMatch = (text, searchTerm) => {
    return text || "N/A";
  };

  // Fetch logs from server with filters and pagination
  const fetchLogs = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        // Build params object
        const params = {
          page: pageToFetch,
          limit: 20,
        };

        // Only add if they have actual values
        if (debouncedSearch && debouncedSearch.trim() !== "") {
          params.search = debouncedSearch.trim();
        }

        if (actionFilter && actionFilter !== "") {
          params.action = actionFilter;
        }

        if (dateFilter && dateFilter !== "") {
          params.date = dateFilter;
        }

        console.log("🔍 Fetching logs with params:", params);
        console.log("   - Search term:", debouncedSearch);
        console.log("   - Action filter:", actionFilter);
        console.log("   - Date filter:", dateFilter);

        const { logs: fetchedLogs, meta } = await getInventoryLogs(params);

        console.log("📦 API Response:");
        console.log("   - Total logs fetched:", fetchedLogs.length);
        console.log("   - Meta:", meta);
        console.log("   - First log:", fetchedLogs[0]);

        setLogs((prev) =>
          pageToFetch === 1 ? fetchedLogs : [...prev, ...fetchedLogs]
        );
        setHasMore(pageToFetch < (meta.last_page || 1));
      } catch (err) {
        console.error("❌ Failed to fetch logs:", err);
        setLogs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, actionFilter, dateFilter]
  );

  // Reset logs when filters/search change
  useEffect(() => {
    console.log("🔄 Filters changed - resetting:");
    console.log("   - Search:", debouncedSearch);
    console.log("   - Action:", actionFilter);
    console.log("   - Date:", dateFilter);
    
    setLogs([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, actionFilter, dateFilter]);

  // Fetch logs when page changes
  useEffect(() => {
    console.log("📄 Page changed to:", page);
    fetchLogs(page);
  }, [page, fetchLogs]);

  // Infinite scroll
  useInfiniteScroll(
    loaderRef,
    () => {
      if (hasMore && !loading) setPage((prev) => prev + 1);
    },
    hasMore,
    loading
  );

  const actionOptions = [
    { value: "", label: "All Actions" },
    { value: "created", label: "Created" },
    { value: "update", label: "Updated" },
    { value: "restock", label: "Restocked" },
    { value: "deducted", label: "Deducted" },
    { value: "deleted", label: "Deleted" },
  ];

  const getActionColor = (action) => {
    switch ((action ?? "").toLowerCase()) {
      case "created": return "text-green-600 font-semibold";
      case "update": return "text-blue-600 font-semibold";
      case "restock": return "text-emerald-600 font-semibold";
      case "deducted": return "text-orange-500 font-semibold";
      case "deleted": return "text-red-600 font-semibold";
      default: return "text-gray-700";
    }
  };

  const formatActionLabel = (action) => {
    const map = {
      created: "Created",
      update: "Updated",
      restock: "Restocked",
      deducted: "Deducted",
      deleted: "Removed",
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
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 min-w-[250px] p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-1 gap-4">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="flex-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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

      {/* Logs */}
      <div className="flex-1 overflow-auto">
        {logs.length === 0 && !loading && (
          <p className="py-6 text-center text-gray-500">
            No inventory logs found
            {(debouncedSearch || actionFilter || dateFilter) && (
              <span className="block text-sm mt-2">
                Try adjusting your filters
              </span>
            )}
          </p>
        )}

        {logs.map((log) => {
          const date = new Date(log.created_at);

          return (
            <div
              key={log.id}
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
                {highlightMatch(log.product_name || "N/A", debouncedSearch)}
              </div>
              <div className="flex flex-col items-end text-gray-700 text-sm">
                <div>
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
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