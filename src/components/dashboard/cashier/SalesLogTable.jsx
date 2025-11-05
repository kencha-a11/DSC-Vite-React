import React, { useMemo, memo, useEffect } from "react";

// Convert "November 04, 2025" -> "2025-11-04"
const convertLogDateToYYYYMMDD = (logDate) => {
  if (!logDate) return null;

  try {
    const [monthName, day, year] = logDate.replace(",", "").split(" ");
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1;
    const monthStr = String(monthIndex).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  } catch (error) {
    console.error("Date conversion error:", error);
    return null;
  }
};

// Single Sales Log Row
const SalesLogEntry = memo(({ log }) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div className="flex flex-col min-w-[50%] pr-4">
      <span className="text-gray-800 font-medium text-base">{log.date}</span>
      <span className="text-gray-500 text-sm">{log.day}</span>
      <span className="text-gray-500 text-sm">{log.time}</span>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-gray-800 font-medium mb-1">
        <span className="font-bold text-fuchsia-600">{log.items}</span> items
      </span>
      <span className="text-gray-500 text-sm">
        Total: <span className="text-green-600 font-bold text-lg">{log.total}</span>
      </span>
      {log.action && (
        <span className="text-gray-400 text-xs mt-1 capitalize">{log.action}</span>
      )}
    </div>
  </div>
));

SalesLogEntry.displayName = "SalesLogEntry";

// Sales Log Table Component with Infinite Scroll
export const SalesLogTable = ({
  data = [],
  meta = {},
  loading = false,
  loadMoreSalesLogs,
  scrollRef,
  sentinelRef,
  dateFilter = "",
}) => {
  const filteredData = useMemo(() => {
    if (!dateFilter) return data;
    return data.filter((log) => {
      const logDateStr = convertLogDateToYYYYMMDD(log.date);
      return logDateStr === dateFilter;
    });
  }, [data, dateFilter]);

  // Observe sentinel for infinite scroll
  useEffect(() => {
    if (!sentinelRef?.current || !loadMoreSalesLogs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          meta.current_page < meta.last_page
        ) {
          loadMoreSalesLogs();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [sentinelRef, loadMoreSalesLogs, loading, meta]);



  // Show empty state
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

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto min-h-0 h-[53vh]"
    >
      {filteredData.map((log, index) => (
        <SalesLogEntry key={log.id ?? `sales-${index}`} log={log} />
      ))}

      {/* Sentinel for infinite scroll - must be at the bottom */}
      <div ref={sentinelRef} className="h-10" />

      {/* Loading indicator */}
      {loading && filteredData.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-600"></div>
          <p className="mt-2 text-sm">Loading more sales...</p>
        </div>
      )}

      {/* End of results indicator */}
      {!loading && meta?.current_page >= meta?.last_page && filteredData.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          End
        </div>
      )}
    </div>
  );
};

export default SalesLogTable;