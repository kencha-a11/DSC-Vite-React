import React, { useState } from "react";
import { PlusIcon } from "../icons/index";
import AddUserModal from "./AddUserModal";

export default function AccountListPanel({
  users = [],
  loading = false,
  loaderRef,
  onSelectUser,
  onToast,
  onSearch,
  onUserAdded,
  searchTerm = "",
}) {
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value;
    onSearch?.(term);
  };

  const handleUserAdded = (newUser) => {
    onUserAdded?.(newUser);
    onToast?.("User added successfully!");
  };

  // ✅ Sort users: active first, inactive later
  const sortedUsers = Array.isArray(users)
    ? [...users].sort((a, b) => {
        const aStatus = a.latest_time_log?.current_status?.toLowerCase() || "inactive";
        const bStatus = b.latest_time_log?.current_status?.toLowerCase() || "inactive";
        if (aStatus === bStatus) return 0;
        return aStatus === "active" || aStatus === "logged_in" ? -1 : 1;
      })
    : [];

  const hasUsers = sortedUsers.length > 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search accounts"
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition duration-150 ease-in-out"
        />

        <button
          onClick={() => setShowModal(true)}
          className="ml-4 flex items-center bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {loading && !hasUsers ? (
          <div className="text-center py-10 text-gray-400">Loading users...</div>
        ) : hasUsers ? (
          <>
            {sortedUsers.map((user) => {
              const fullName =
                user.name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "Unnamed User";

              const initial =
                user.first_name?.charAt(0)?.toUpperCase?.() ||
                user.last_name?.charAt(0)?.toUpperCase?.() ||
                fullName?.charAt(0)?.toUpperCase?.() ||
                "?";

              const currentStatus = user.latest_time_log?.current_status || "Inactive";

              const isActive =
                currentStatus.toLowerCase() === "active" ||
                currentStatus.toLowerCase() === "logged_in";

              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser?.(user)}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  {/* Left side: avatar + name */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                      {initial}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{fullName}</p>
                      <p className="text-sm text-gray-500">{user.email || "-"}</p>
                    </div>
                  </div>

                  {/* Right side: show pill only for active users */}
                  {isActive && (
                    <div className="text-xs px-3 py-1 font-medium rounded-full bg-green-100 text-green-700">
                      Active
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Loading more users...
              </div>
            )}

            <div ref={loaderRef} className="h-4" />
          </>
        ) : (
          <div className="text-center py-10 text-gray-400">
            {searchTerm
              ? `No users found for "${searchTerm}"`
              : "No users found"}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onUserAdded={handleUserAdded}
          onToast={onToast}
        />
      )}
    </div>
  );
}
