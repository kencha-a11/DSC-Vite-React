import React, { useState } from "react";
import { PlusIcon } from "../icons/index"; 
import AddUserModal from "./AddUserModal";

export default function AccountListPanel({
  users = [],             // default empty array
  loading = false,        // default false
  loaderRef,
  onSelectUser,
  onToast,
  onSearch,
  onUserAdded,
  searchTerm = ""         // default empty string
}) {
  console.log("📝 AccountListPanel rendered", { users, loading, searchTerm });

  const [showModal, setShowModal] = useState(false);
  console.log("🔹 Modal state:", showModal);

  const handleSearch = (e) => {
    const term = e.target.value;
    console.log("🔍 Search input changed:", term);
    onSearch?.(term); // optional chaining
  };

  const handleUserAdded = (newUser) => {
    console.log("➕ Adding new user:", newUser);
    onUserAdded?.(newUser);
    onToast?.("User added successfully!");
  };

  const hasUsers = Array.isArray(users) && users.length > 0;
  console.log("ℹ️ Has users?", hasUsers);

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
          onClick={() => {
            console.log("🟢 Open Add User Modal");
            setShowModal(true);
          }}
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
            {users.map((user) => {
              console.log("👤 Rendering user:", user);

              // Use `user.name` if present, fallback to first + last name
              const fullName =
                user.name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "Unnamed User";

              // Compute initial
              const initial =
                user.first_name?.charAt(0)?.toUpperCase?.() ||
                user.last_name?.charAt(0)?.toUpperCase?.() ||
                fullName?.charAt(0)?.toUpperCase?.() ||
                "?";

              console.log("ℹ️ User fullName & initial:", fullName, initial);

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    console.log("👆 User clicked:", user);
                    onSelectUser?.(user);
                  }}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                      {initial}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{fullName}</p>
                      <p className="text-sm text-gray-500">{user.email || "-"}</p>
                    </div>
                  </div>

                  {user.active_status === "active" && (
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

            {/* Infinite scroll trigger */}
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
          onClose={() => {
            console.log("❌ Closing Add User Modal");
            setShowModal(false);
          }}
          onUserAdded={handleUserAdded}
          onToast={onToast}
        />
      )}
    </div>
  );
}
