import React, { useRef, useEffect, memo, useMemo } from "react";

// ==============================
// Helper: Convert "November 04, 2025" -> "2025-11-04"
// ==============================
const convertLogDateToYYYYMMDD = (logDate) => {
  if (!logDate) return null;

  const [monthName, day, year] = logDate.replace(",", "").split(" "); // ["November", "04", "2025"]
  const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1; // month as number
  const monthStr = String(monthIndex).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");

  return `${year}-${monthStr}-${dayStr}`; // "2025-11-04"
};

// ==============================
// Single Sales Log Row
// ==============================
const SalesLogEntry = memo(({ log }) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
    <div className="flex flex-col min-w-[50%] pr-4">
      <span className="text-gray-800 font-medium text-base">{log.date}</span>
      <span className="text-gray-500 text-sm">{log.day}</span>
      <span className="text-gray-500 text-sm">{log.time}</span>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-gray-800 font-medium mb-1">
        <span className="font-bold">{log.items}</span> items
      </span>
      <span className="text-gray-500 text-sm">
        Total: <span className="text-green-600 font-bold text-lg">{log.total}</span>
      </span>
    </div>
  </div>
));

SalesLogEntry.displayName = "SalesLogEntry";

// ==============================
// Sales Log Table Component
// ==============================
export const SalesLogTable = ({
  data = [],
  meta = {},
  loading = false,
  loadMore = () => {},
  scrollRef = null,
  dateFilter = "",
}) => {
  const internalRef = useRef(null);
  const observerRef = useRef(null);
  const containerRef = scrollRef || internalRef;

  // ------------------------------
  // Filter logs by selected date
  // ------------------------------
  const filteredData = useMemo(() => {
    if (!dateFilter) return data;

    return data.filter((log) => {
      const logDateStr = convertLogDateToYYYYMMDD(log.date);
      return logDateStr === dateFilter;
    });
  }, [data, dateFilter]);

  // ------------------------------
  // Infinite Scroll Observer
  // ------------------------------
  useEffect(() => {
    if (!observerRef.current || !containerRef.current || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && meta?.current_page < meta?.last_page) {
          loadMore();
        }
      },
      { root: containerRef.current, rootMargin: "150px", threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, meta?.current_page, meta?.last_page, loadMore, containerRef]);

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 h-[53vh]">
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-4 text-gray-400">No sales logs found</div>
      )}

      {filteredData.map((log, index) => (
        <SalesLogEntry key={log.id ?? `sales-${index}`} log={log} />
      ))}

      <div ref={observerRef} className="h-10" />

      {loading && filteredData.length > 0 && (
        <div className="text-center py-2 text-gray-500 animate-pulse">
          Loading more sales...
        </div>
      )}

      {!loading && meta?.current_page >= meta?.last_page && filteredData.length > 0 && (
        <div className="text-center py-2 text-gray-400 text-sm">
          — End of sales logs —
        </div>
      )}
    </div>
  );
};
