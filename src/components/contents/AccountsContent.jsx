import { useState } from "react";
import useAccountHandler from "./useAccountHandler";
import AccountListPanel from "../accounts/AccountListPanel";
import UserLogProfileCard from "../accounts/UserLogProfileCard";
import MessageToast from "../MessageToast";

export default function AccountsContent() {
  const {
    users = [], // ensure it's always an array
    loading,
    error,
    hasMore,
    totalUsers,
    searchTerm,
    loaderRef,
    handleSearch,
    handleUserAdded,
    handleUserUpdated,
  } = useAccountHandler();

  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToast = (message) => setToastMessage(message);

  const handleSelectUser = (user) => {
    console.log("👤 User selected:", user);
    setSelectedUser(user);
  };

  const handleUserAddedWithToast = (newUser) => {
    handleUserAdded(newUser);
    handleToast("User added successfully!");
  };

  const handleUserUpdatedWithToast = (updatedUser) => {
    handleUserUpdated(updatedUser);
    // Update selected user if it's the one being edited
    if (selectedUser?.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
    handleToast("User updated successfully!");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">Error loading accounts: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh] w-full overflow-hidden bg-gray-50 relative">
      {/* Header with total count */}
      <div className="px-4 py-2 bg-white border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Total Users: <span className="font-semibold">{totalUsers}</span>
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="flex-2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <AccountListPanel
              users={Array.isArray(users) ? users : []} // ensure array
              loading={loading}
              loaderRef={loaderRef}
              searchTerm={searchTerm}
              onSelectUser={handleSelectUser}
              onToast={handleToast}
              onSearch={handleSearch}
              onUserAdded={handleUserAddedWithToast}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-y-auto border-l border-gray-200">
          <UserLogProfileCard
            selectedUser={selectedUser}
            onToast={handleToast}
            onUserUpdated={handleUserUpdatedWithToast}
          />
        </div>
      </div>

      {/* Toast – render outside scrollable panels */}
      {toastMessage && (
        <MessageToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={1500}
        />
      )}
    </div>
  );
}
