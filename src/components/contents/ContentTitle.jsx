// src/components/dashboard/ContentTitle.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

export default function ContentTitle({ Title }) {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  // Formatters using Intl for better locale/timezone support
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // ✅ show seconds for real-time feel
    hour12: true,
  });

  useEffect(() => {
    // Use a precise interval to avoid time drift
    const tick = () => setNow(new Date());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div className="flex justify-between items-center px-4 py-5 border-b bg-white shadow-sm">
      <div className="text-2xl font-bold text-gray-800">{Title}</div>
      <div className="text-right text-gray-600 text-sm font-medium">
        <div>{dateFormatter.format(now)}</div>
        <div className="font-semibold text-gray-700">{timeFormatter.format(now)}</div>
      </div>
    </div>
  );
}
