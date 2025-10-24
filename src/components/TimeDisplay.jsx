// src/components/dashboard/TimeDisplay.jsx
import { useState, useEffect } from "react";

export default function TimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time like "10:10 AM"
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  // Format date like "Monday, September 26"
  const dateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div className="bg-pink-500 text-white rounded-lg px-4 py-4 text-center">
      <div className="text-2xl font-extrabold leading-tight">{timeString}</div>
      <div className="text-sm opacity-90">{dateString}</div>
    </div>
  );
}
