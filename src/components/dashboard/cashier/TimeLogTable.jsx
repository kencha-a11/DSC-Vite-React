import React, { useEffect, useMemo, memo, useState } from "react";

// Single TimeLog Row Component
const TimeLogEntry = memo(({ log }) => {
  const [duration, setDuration] = useState(log.duration ?? "0h 0m");

  useEffect(() => {
    // Only update duration if log is ongoing (no end time)
    if (log.end !== "Ongoing") {
      // Use backend duration for completed logs
      setDuration(log.duration ?? "0h 0m");
      return;
    }

    // For ongoing logs, calculate live duration
    if (!log.start_time) return;

    const startMs = Date.parse(log.start_time);
    if (isNaN(startMs)) {
      console.error("Invalid start_time:", log.start_time);
      return;
    }

    const updateDuration = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - startMs);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setDuration(`${hours}h ${minutes}m`);
    };

    updateDuration(); // Initial update
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [log.start_time, log.end, log.duration]);

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col min-w-[50%] pr-4">
        <span className="text-gray-800 font-medium text-base">{log.date}</span>
        <span className="text-gray-500 text-sm">{log.day}</span>
        <span className="text-gray-500 text-sm">{log.time}</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-800 font-medium">
          Start: {log.start}
        </span>
        <span className="text-gray-800 font-medium mb-1">
          End: {log.end}
        </span>
        <span className="text-gray-800 font-medium mb-1">
          Duration: <span className="font-bold text-fuchsia-600">{duration}</span>
        </span>
        {log.status && (
          <span className="text-gray-500 text-sm capitalize">{log.status}</span>
        )}
      </div>
    </div>
  );
});

TimeLogEntry.displayName = "TimeLogEntry";

// TimeLog Table Component with Infinite Scroll
export const TimeLogTable = ({
  data = [],
  meta = {},
  loading = false,
  loadMoreTimeLogs,
  scrollRef,
  sentinelRef,
}) => {
  // Observe sentinel for infinite scroll
  useEffect(() => {
    if (!sentinelRef?.current || !loadMoreTimeLogs) return;

    const loadingRef = { current: loading }; // simple ref object
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingRef.current &&
          meta.current_page < meta.last_page
        ) {
          loadMoreTimeLogs();
        }
      },
      {
        root: null,   // observe viewport instead of scrollRef
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [sentinelRef, loadMoreTimeLogs, meta]);


  if (data.length === 0 && !loading) {
    return (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 h-[53vh] flex items-center justify-center"
      >
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No time logs found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto min-h-0 h-[53vh]"
    >
      {data.map((log, index) => (
        <TimeLogEntry key={log.id ?? `time-${index}`} log={log} />
      ))}

      <div ref={sentinelRef} className="h-10" />

      {loading && data.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-600"></div>
          <p className="mt-2 text-sm">Loading more logs...</p>
        </div>
      )}

      {!loading && meta?.current_page >= meta?.last_page && data.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          End
        </div>
      )}
    </div>
  );
};

export default TimeLogTable;