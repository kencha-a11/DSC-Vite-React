import { useState, useEffect } from "react";
import EditUserModal from "./EditUserModal";

export default function UserLogProfileCard({ selectedUser }) {
  const [activeTab, setActiveTab] = useState("Time log");
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(selectedUser || null);
  }, [selectedUser]);

  if (!user || !user.first_name) {
    return (
      <div className="w-96 h-full bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Select a user to view logs</p>
      </div>
    );
  }

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
      {/* 👤 Profile Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone_number}</p>
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

      {/* 🧭 Tabs */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-shrink-0 bg-gray-50 border-b border-gray-200">
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
            user.time_logs?.map((entry) => {
              const startDate = new Date(entry.start_time);
              const endDate = entry.end_time ? new Date(entry.end_time) : null;
              const dayOfWeek = startDate.toLocaleDateString(undefined, { weekday: "long" });

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
                      {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500">End</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {endDate
                        ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "-"}
                    </p>
                  </div>
                </div>
              );
            })}


          {/* Sales Log */}
          {activeTab === "Sales log" &&
            user.sales_logs?.map((entry, index) => (
              <div
                key={index}
                className="py-4 border-b last:border-b-0 border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900">{fullName}</h3>
                      <span className="text-sm text-gray-900 font-semibold">{entry.time}</span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <div className="text-xs text-gray-500">
                        <p>{entry.date}</p>
                        <p>{entry.items} items</p>
                      </div>
                      <p className="text-sm font-bold text-green-600">₱{entry.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
