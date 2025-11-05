import React, { useRef, useEffect, memo, useMemo, useState } from "react";

// ==============================
// Parse time string like "10:19 AM" to a Date object
// ==============================
const parseTime = (dateStr, timeStr) => {
  if (!timeStr || timeStr.toLowerCase() === "ongoing") return null;

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const dateParts = new Date(dateStr);
  dateParts.setHours(hours, minutes, 0, 0);
  return dateParts;
};

// ==============================
// Calculate duration in hours (always positive)
// ==============================
const calculateDuration = (startStr, endStr, dateStr) => {
  const start = parseTime(dateStr, startStr);
  let end;

  if (endStr.toLowerCase() === "ongoing") {
    end = new Date(); // use current time for ongoing
  } else {
    end = parseTime(dateStr, endStr);
  }

  if (!start || !end) return 0;

  const diffMs = end - start;
  return diffMs > 0 ? diffMs / 1000 / 60 / 60 : 0; // duration in hours
};

// ==============================
// Format duration
// ==============================
const formatDuration = (hours) => {
  if (!hours || isNaN(hours)) return "0h";

  const totalMinutes = Math.round(Math.abs(Number(hours)) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ==============================
// Convert "November 05, 2025" to "2025-11-05" for date input comparison
// ==============================
const convertLogDateToYYYYMMDD = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

// ==============================
// Single Time Log Row (with live update for ongoing logs)
// ==============================
const TimeLogEntry = memo(({ log }) => {
  const [duration, setDuration] = useState(
    calculateDuration(log.start, log.end, log.date)
  );

  useEffect(() => {
    if (log.end.toLowerCase() !== "ongoing") return;

    const interval = setInterval(() => {
      setDuration(calculateDuration(log.start, log.end, log.date));
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [log.start, log.end, log.date]);

  return (
    <div className="flex justify-between border-b border-gray-200 p-4">
      <div className="flex flex-col justify-start min-w-[55%]">
        <span className="text-gray-800 font-medium text-base">{log.date}</span>
        <span className="text-gray-500 text-sm">{log.day}</span>
      </div>

      <div className="flex flex-col justify-between text-right flex-1 h-full">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Start</span>
          <span className="text-gray-800 font-medium">{log.start}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">End</span>
          <span className="text-gray-800 font-medium">{log.end}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-gray-800 font-bold">Duration</span>
          <span className="text-gray-800 font-bold">{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
});

TimeLogEntry.displayName = "TimeLogEntry";

// ==============================
// Time Log Table Component
// ==============================
export const TimeLogTable = ({
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
        <div className="text-center py-4 text-gray-400">No time logs found</div>
      )}

      {filteredData.map((log, index) => (
        <TimeLogEntry key={log.id ?? `log-${index}`} log={log} />
      ))}

      <div ref={observerRef} className="h-10" />

      {loading && filteredData.length > 0 && (
        <div className="text-center py-2 text-gray-500 animate-pulse">
          Loading more logs...
        </div>
      )}

      {!loading && meta?.current_page >= meta?.last_page && filteredData.length > 0 && (
        <div className="text-center py-2 text-gray-400 text-sm">
          — End of time logs —
        </div>
      )}
    </div>
  );
};
