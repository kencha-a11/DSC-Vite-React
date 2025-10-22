import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getUsersData } from "../../services/userServices";
import AddUserModal from "./AddUserModal";

export default function AccountListPanel({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsersData();

      // Use latest_time_log for the status
      const mappedUsers = data.map(user => ({
        ...user,
        active_status: user.latest_time_log?.current_status === "Active" ? "active" : "inactive"
      }));

      // Sort: active users first
      const sortedUsers = mappedUsers.sort((a, b) =>
        a.active_status === b.active_status ? 0 : a.active_status === "active" ? -1 : 1
      );

      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = users
      .filter(u => `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase().includes(term))
      .sort((a, b) =>
        a.active_status === b.active_status ? 0 : a.active_status === "active" ? -1 : 1
      );

    setFilteredUsers(results);
  };

  const handleUserAdded = (newUser) => {
    const updatedUsers = [...users, newUser].sort((a, b) =>
      a.active_status === b.active_status ? 0 : a.active_status === "active" ? -1 : 1
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search accounts"
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        />
        <button
          onClick={() => setShowModal(true)}
          className="ml-4 flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const firstName = user.first_name || "";
            const lastName = user.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unnamed User";
            const initial = firstName?.charAt?.(0)?.toUpperCase?.() || "?";

            return (
              <div
                key={user.id}
                onClick={() => onSelectUser && onSelectUser(user)}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                    {initial}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {/* Green/Red status circle */}
                <div
                  className={`text-xs px-3 py-1 font-medium rounded-full ${user.active_status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500 font-medium">
            No users found
          </div>
        )}
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
}
