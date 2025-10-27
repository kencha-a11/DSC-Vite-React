import { useState, useEffect } from "react";
import EditUserModal from "./EditUserModal";
import { formatPeso } from "../../utils/formatPeso";

export default function UserLogProfileCard({ selectedUser, onToast }) {
  const [activeTab, setActiveTab] = useState("Time log");
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(selectedUser || null);
  }, [selectedUser]);

  if (!user || !user.first_name) {
    return (
      <div className="w-full h-full bg-white shadow-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a user to view logs</p>
      </div>
    );
  }

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  // 1. Sort time logs by start_time descending
  const sortedTimeLogs = [...(user.time_logs || [])].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );

  // 2. Sort sales logs by date + time descending
  const sortedSalesLogs = [...(user.sales_logs || [])].sort(
    (a, b) =>
      new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)
  );

  return (
    <div className="w-full h-full bg-white shadow-lg border border-gray-200 flex flex-col">
      {/* Profile Header */}
      <div className="shrink-0 p-6 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full shrink-0"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone_number}</p>
              {user.latest_time_log && (
                <p
                  className={`text-sm font-semibold ${user.latest_time_log.current_status === "Active"
                    ? "text-green-600"
                    : "text-gray-500"
                    }`}
                >
                  {user.latest_time_log.current_status}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition"
        >
          Edit profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex shrink-0 bg-gray-50 border-b border-gray-200">
          {["Time log", "Sales log"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition duration-150 ease-in-out ${activeTab === tab
                ? "bg-white border-b-2 border-black text-black"
                : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Logs Container */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* Time Log */}
          {activeTab === "Time log" &&
            (sortedTimeLogs.length === 0 ? (
              <p className="text-center text-gray-500 pt-8">
                No time log entries found.
              </p>
            ) : (
              sortedTimeLogs.map((entry) => {
                const startDate = new Date(entry.start_time);
                const endDate = entry.end_time ? new Date(entry.end_time) : null;
                const dayOfWeek = startDate.toLocaleDateString(undefined, {
                  weekday: "long",
                });

                return (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center py-4 border-b last:border-b-0 border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {startDate.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{dayOfWeek}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-gray-500">Start</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {startDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-500">End</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {endDate
                          ? endDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "-"}
                      </p>
                    </div>
                  </div>
                );
              })
            ))}

          {/* Sales Log */}
          {activeTab === "Sales log" &&
            (sortedSalesLogs.length === 0 ? (
              <p className="text-center text-gray-500 pt-8">
                No sales log entries found.
              </p>
            ) : (
              sortedSalesLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="py-4 border-b last:border-b-0 border-gray-100 flex flex-col"
                >
                  {/* Top row: snapshots on left, date/time on right */}
                  <div className="flex justify-between mb-2">
                    {/* Snapshots left */}
                    <div className="flex-1 text-xs text-gray-500 space-y-1">
                      {entry.sale_items && entry.sale_items.length > 0 ? (
                        entry.sale_items.map((item, i) => (
                          <p key={i}>
                            {item.snapshot_name || "Unknown Product"} × {item.snapshot_quantity} @{" "}
                            {formatPeso(item.snapshot_price, false)}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-orange-600 italic">
                          Product details unavailable
                        </p>
                      )}
                    </div>

                    {/* Date/time right upper */}
                    <div className="flex flex-col items-end text-right ml-4">
                      <span className="text-sm text-gray-900 font-semibold">{entry.time}</span>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                  </div>

                  {/* Footer: total right */}
                  <div className="flex justify-end mt-2">
                    <p className="text-sm font-bold text-green-600">{formatPeso(entry.total)}</p>
                  </div>
                </div>
              ))
            ))}

        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={handleUserUpdated}
          onToast={onToast} // ✅ pass it down
        />
      )}

    </div>
  );
}
