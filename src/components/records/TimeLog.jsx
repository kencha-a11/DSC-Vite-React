import React, { useEffect, useState, useRef, useCallback } from "react";
import { getTimeLogs } from "../../services/logServices";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function TimeLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // ✅ new filter
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef();
  const debouncedSearch = useDebounce(search, 400);

  // Fetch logs from API with pagination
  const fetchLogs = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const params = {
          user_id: userFilter || undefined,
          date: dateFilter || undefined,
          status: statusFilter || undefined,
          page: pageToFetch,
          limit: 20,
        };
        const data = await getTimeLogs(params);

        setLogs(prev => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(data.length > 0);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [userFilter, dateFilter, statusFilter]
  );

  // Reset logs and page when filters/search change
  useEffect(() => {
    setLogs([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, userFilter, dateFilter, statusFilter]);

  // Fetch logs when page changes
  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  // Infinite scroll
  useInfiniteScroll(loaderRef, () => {
    if (hasMore && !loading) setPage(prev => prev + 1);
  }, hasMore, loading);

  const filteredLogs = logs.filter(log =>
    (log.user?.name ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
  ).filter(log => {
    if (statusFilter === "online") return log.end_time === null;
    if (statusFilter === "offline") return log.end_time !== null;
    return true;
  });

  const computeDuration = (start, end) => {
    if (!start) return "--";
    if (!end) return "Ongoing";
    const diffMs = new Date(end) - new Date(start);
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 p-2 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center text-gray-600 font-medium text-sm border-y border-gray-200 bg-gray-100 py-3 px-8 select-none pr-12">
        <div className="text-left">User</div>
        <div className="text-left">Date</div>
        <div className="text-left">Time</div>
        <div className="text-right">Duration</div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-auto">
        {!loading && filteredLogs.length === 0 && (
          <p className="py-6 text-center text-gray-500">No logs found</p>
        )}

        {filteredLogs.map((log, index) => {
          const startDate = new Date(log.start_time);
          const endDate = log.end_time ? new Date(log.end_time) : null;

          return (
            <div
              key={`log-${log.id ?? index}`}
              className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center px-8 py-4 border-t border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 py-4">
                <div className="relative">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-500 text-white font-semibold text-lg uppercase">
                    {log.user?.name ? log.user.name.charAt(0) : "?"}
                  </div>
                  {!log.end_time && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <span className="font-medium text-gray-800">{log.user?.name ?? "N/A"}</span>
              </div>

              <div className="text-gray-700 text-sm">
                <div>{startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                <div className="text-xs text-gray-500">{startDate.toLocaleDateString("en-US", { weekday: "long" })}</div>
              </div>

              <div className="text-gray-700 text-sm">
                <div>Start {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div>End {log.end_time ? endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
              </div>

              <div className="text-gray-800 text-sm font-semibold text-right">
                {computeDuration(log.start_time, log.end_time)}
              </div>
            </div>
          );
        })}

        {/* Infinite scroll loader */}
        {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}
        <div ref={loaderRef} className="h-10"></div>
      </div>
    </div>
  );
}
