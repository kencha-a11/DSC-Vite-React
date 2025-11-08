import React, { useEffect, useState, memo } from "react";

// 🕒 TIME LOG ENTRY (handles live duration updates)
const TimeLogEntry = memo(({ log }) => {
  const [duration, setDuration] = useState(log?.duration ?? "0m");

  useEffect(() => {
    let mounted = true;
    let intervalId = null;
    const ENABLE_DEBUG = true;

    const debug = (...args) => {
      if (ENABLE_DEBUG) console.debug("[TimeLogEntry]", ...args);
    };

    debug("🟢 effect start", { log });

    if (!log) {
      debug("⚠️ no log provided");
      return () => { mounted = false; };
    }

    if (log.end !== "Ongoing") {
      debug("ℹ️ log is not ongoing, static duration:", log.duration);
      setDuration(log.duration ?? "0m");
      return () => { mounted = false; };
    }

    // ✅ Try to parse start timestamp
    const tryParseStartMs = () => {
      debug("🔍 Parsing start_time:", log.start_time);

      if (log.start_time) {
        const safeStart = log.start_time.replace(/\.\d+Z$/, "Z");
        const parsed = Date.parse(safeStart);
        debug("📅 Date.parse(safeStart):", { safeStart, parsed });

        if (!Number.isNaN(parsed)) return parsed;

        const alt = new Date(safeStart).getTime();
        debug("📅 new Date().getTime():", { safeStart, alt });
        if (!Number.isNaN(alt)) return alt;
      }

      if (log.date && log.start) {
        const combined = `${log.date} ${log.start}`;
        const parsed2 = Date.parse(combined);
        debug("📅 Date.parse(date + start):", { combined, parsed2 });
        if (!Number.isNaN(parsed2)) return parsed2;

        // Manual parse fallback
        try {
          debug("⚙️ Manual parse fallback:", { date: log.date, start: log.start });
          const [monthName, dayWithComma, year] = log.date.split(" ");
          const day = parseInt(dayWithComma.replace(",", ""), 10);
          const [time, meridian] = log.start.split(" ");
          let [hour, minute] = time.split(":").map(Number);
          if (meridian === "PM" && hour !== 12) hour += 12;
          if (meridian === "AM" && hour === 12) hour = 0;
          const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
          const manualDate = new Date(Number(year), monthIndex, day, hour, minute, 0);
          debug("🧭 Manual Date constructed:", manualDate.toISOString());
          return manualDate.getTime();
        } catch (err) {
          console.error("❌ Manual parse error:", err);
        }
      }

      if (log.start_time && typeof log.start_time === "string") {
        const maybeIso = log.start_time.endsWith("Z") ? log.start_time : `${log.start_time}Z`;
        const parsed3 = Date.parse(maybeIso);
        debug("📅 Try append Z:", { maybeIso, parsed3 });
        if (!Number.isNaN(parsed3)) return parsed3;
      }

      debug("🚫 All parsing attempts failed");
      return NaN;
    };

    const startMs = tryParseStartMs();
    debug("✅ final startMs:", startMs);

    if (Number.isNaN(startMs)) {
      console.error("[TimeLogEntry] ❌ Could not parse start timestamp:", log);
      return () => { mounted = false; };
    }

    const now = Date.now();
    const TOLERANCE_MS = 5000;
    if (startMs - now > TOLERANCE_MS) {
      console.warn("[TimeLogEntry] ⚠️ start is in the future", {
        startMs,
        startIso: new Date(startMs).toISOString(),
        now,
        nowIso: new Date(now).toISOString(),
        diffMs: startMs - now,
      });
    }

    const updateDuration = () => {
      if (!mounted) return;
      const nowInner = Date.now();
      const diffMs = Math.max(0, nowInner - startMs);
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const formatted =
        totalMinutes < 1 ? "0m" :
        hours === 0 ? `${minutes}m` :
        minutes === 0 ? `${hours}h` :
        `${hours}h ${minutes}m`;

      debug("🕒 updateDuration", {
        nowInner,
        startMs,
        diffMs,
        totalMinutes,
        hours,
        minutes,
        formatted,
      });

      setDuration((prev) => (prev === formatted ? prev : formatted));
    };

    updateDuration();
    intervalId = setInterval(updateDuration, 1000);

    return () => {
      debug("🔴 cleanup");
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
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

// 🧾 TIME LOG TABLE (renders list + infinite scroll)
export const TimeLogTable = ({
  data = [],
  meta = {},
  loading = false,
  loadMoreTimeLogs,
  scrollRef,
  sentinelRef,
}) => {
  // 🕳️ Empty state
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

  // ✅ Main render
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 h-[53vh]">
      {data.map((log, index) => (
        <TimeLogEntry key={log.id ?? `time-${index}`} log={log} />
      ))}

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
