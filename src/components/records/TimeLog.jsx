import React, { useEffect, useState } from "react";
import { getTimeLogs } from "../../services/logServices";

export default function TimeLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // ✅ new filter

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        user_id: userFilter || undefined,
        date: dateFilter || undefined,
        status: statusFilter || undefined, // send status param
      };
      const data = await getTimeLogs(params);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userFilter, dateFilter, statusFilter]);

  const filteredLogs = logs
    .filter((log) =>
      (log.user?.name ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((log) => {
      if (statusFilter === "online") return log.end_time === null;
      if (statusFilter === "offline") return log.end_time !== null;
      return true;
    });

  const computeDuration = (start, end) => {
    if (!start) return "--";
    if (!end) return "Ongoing";

    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMins = Math.floor(diffMs / 60000);

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const uniqueUsers = Array.from(
    new Map(logs.map((l) => [l.user?.id, l.user])).values()
  ).sort((a, b) => (a?.name ?? "").localeCompare(b?.name ?? ""));

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="text-2xl font-bold text-gray-800">Time Log</div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search..."
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
            {uniqueUsers.map((user) => (
              <option key={user?.id} value={user?.id}>
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

          {/* ✅ Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-4 text-gray-500 font-semibold text-sm border-t pt-2">
          <div className="text-left">User</div>
          <div className="text-center">Date</div>
          <div className="text-center">Time</div>
          <div className="text-right">Duration</div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {loading && <p>Loading...</p>}
        {!loading && filteredLogs.length === 0 && <p>No logs found</p>}

        {!loading &&
          filteredLogs.map((log, logIndex) => {
            const startDate = new Date(log.start_time);
            const endDate = log.end_time ? new Date(log.end_time) : null;

            return (
              <div
                key={`${log.id ?? "log"}-${logIndex}`}
                className="grid grid-cols-4 items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                {/* USER */}
                <div className="flex items-center gap-3 text-left">
                  <div className="relative">
                    <img
                      src={log.user?.avatar || "https://via.placeholder.com/40"}
                      alt={log.user?.name ?? "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {!log.end_time && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <span className="font-medium">{log.user?.name ?? "N/A"}</span>
                </div>

                {/* DATE */}
                <div className="text-gray-600 text-sm text-center">
                  <div>
                    {startDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {startDate.toLocaleDateString("en-US", { weekday: "long" })}
                  </div>
                </div>

                {/* TIME */}
                <div className="text-gray-600 text-sm text-center">
                  <div>
                    Start {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div>
                    End{" "}
                    {log.end_time
                      ? endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "--:--"}
                  </div>
                </div>

                {/* DURATION */}
                <div className="text-gray-800 text-sm font-semibold text-right">
                  {computeDuration(log.start_time, log.end_time)}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
