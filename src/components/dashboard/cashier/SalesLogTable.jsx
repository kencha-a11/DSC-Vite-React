import React, { useMemo, memo, useEffect } from "react";

// -----------------------------
// Single Sales Log Row
// -----------------------------
const SalesLogEntry = memo(({ log }) => {
  // Display time safely
  const formattedTime = log.time ?? "N/A";

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col min-w-[50%] pr-4">
        <span className="text-gray-800 font-medium text-base">{log.date}</span>
        <span className="text-gray-500 text-sm">{log.day}</span>
        <span className="text-gray-500 text-sm">{formattedTime}</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-800 font-medium mb-1">
          <span className="font-bold text-fuchsia-600">{log.items}</span> items
        </span>
        <span className="text-gray-500 text-sm">
          Total: <span className="text-green-600 font-bold text-lg">{log.total}</span>
        </span>
      </div>
    </div>
  );
});

SalesLogEntry.displayName = "SalesLogEntry";

// -----------------------------
// Sales Log Table Component
// -----------------------------
export const SalesLogTable = ({
  data = [],
  meta = {},
  loading = false,
  loadMoreSalesLogs,
  scrollRef,
  sentinelRef,
  dateFilter = "",
}) => {
  // -----------------------------
  // Filter and sort data
  // -----------------------------
  const filteredData = useMemo(() => {
    let logs = data;

    if (dateFilter) {
      // Filter by date using ISO string (start_time includes full datetime)
      // We only compare the date portion
      logs = logs.filter((log) => log.start_time.startsWith(dateFilter));
    }

    // Sort descending by full ISO datetime
    // This ensures newest logs appear first
    logs.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

    return logs;
  }, [data, dateFilter]);

  // -----------------------------
  // Infinite scroll observer
  // -----------------------------
  useEffect(() => {
    if (!sentinelRef?.current || !loadMoreSalesLogs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && meta.current_page < meta.last_page) {
          loadMoreSalesLogs();
        }
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef, loadMoreSalesLogs, loading, meta]);

  // -----------------------------
  // Empty state
  // -----------------------------
  if (filteredData.length === 0 && !loading) {
    return (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 h-[53vh] flex items-center justify-center"
      >
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No sales logs found</p>
          {dateFilter && (
            <p className="text-gray-400 text-sm mt-2">
              Try selecting a different date
            </p>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------
  // Render table
  // -----------------------------
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 h-[53vh]">
      {filteredData.map((log, index) => (
        <SalesLogEntry key={log.id ?? `sales-${index}`} log={log} />
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-10" />

      {/* Loading indicator */}
      {loading && filteredData.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-600"></div>
          <p className="mt-2 text-sm">Loading more sales...</p>
        </div>
      )}

      {/* End of results */}
      {!loading && meta?.current_page >= meta?.last_page && filteredData.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">End</div>
      )}
    </div>
  );
};

export default SalesLogTable;
