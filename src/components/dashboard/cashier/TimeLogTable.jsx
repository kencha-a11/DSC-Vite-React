import React, { useEffect, useState, memo } from "react";

// 🕒 TIME LOG ENTRY
const TimeLogEntry = memo(({ log }) => {
  const [duration, setDuration] = useState(formatDuration(log?.duration));

  useEffect(() => {
    if (!log || log.end !== "Ongoing") {
      setDuration(formatDuration(log?.duration));
      return;
    }

    const startMs = new Date(log.start_time || log.date + " " + log.start).getTime();
    if (isNaN(startMs)) return;

    const update = () => {
      const diffMs = Math.max(0, Date.now() - startMs);
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      setDuration(formatDuration(totalMinutes));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [log]);

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col min-w-[50%] pr-4">
        <span className="text-gray-800 font-medium text-base">{log?.date}</span>
        <span className="text-gray-500 text-sm">{log?.day}</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-800 font-medium">Start: {log?.start}</span>
        <span className="text-gray-800 font-medium mb-1">End: {log?.end}</span>
        <span className="text-gray-800 font-medium">
          Duration: <span className="font-bold">{duration}</span>
        </span>
      </div>
    </div>
  );
});

TimeLogEntry.displayName = "TimeLogEntry";

// Helper: format minutes into string (Xh Ym), no decimals
function formatDuration(value) {
  if (!value) return "0m";
  const totalMinutes = Math.floor(typeof value === "number" ? value : parseFloat(value));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalMinutes < 1) return "0m";
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// 🧾 TIME LOG TABLE
export const TimeLogTable = ({ data = [], meta = {}, loading = false, scrollRef, sentinelRef }) => {
  if (data.length === 0 && !loading)
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 h-[53vh] flex items-center justify-center">
        <div className="text-center py-8 text-gray-400 text-lg">No time logs found</div>
      </div>
    );

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 h-[53vh]">
      {data.map((log, i) => <TimeLogEntry key={log.id ?? `time-${i}`} log={log} />)}
      <div ref={sentinelRef} className="h-10" />
      {loading && data.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2"></div>
          <p className="mt-2 text-sm">Loading more logs...</p>
        </div>
      )}
      {!loading && meta?.current_page >= meta?.last_page && data.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">End</div>
      )}
    </div>
  );
};

export default TimeLogTable;
