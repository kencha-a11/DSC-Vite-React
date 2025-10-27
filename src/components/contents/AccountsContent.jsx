import { useState } from "react";
import { useUsersData } from "../../hooks/useUsersData";
import AccountListPanel from "../accounts/AccountListPanel";
import UserLogProfileCard from "../accounts/UserLogProfileCard";
import MessageToast from "../MessageToast";

export default function AccountsContent() {
  const { data, isLoading, isError, error } = useUsersData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToast = (message) => setToastMessage(message);

  const filteredAccounts = (data || []).filter((user) => {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) return <p>Loading accounts...</p>;
  if (isError) return <p>Error loading accounts: {error.message}</p>;

  return (
    <div className="flex flex-col h-[90vh] w-full overflow-hidden bg-gray-50 relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="flex-2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <AccountListPanel
              users={filteredAccounts}
              onSelectUser={setSelectedUser}
              onToast={handleToast}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-y-auto border-l border-gray-200">
          <UserLogProfileCard
            selectedUser={selectedUser}
            onToast={handleToast}
          />
        </div>
      </div>

      {/* Toast – render outside scrollable panels */}
      {toastMessage && (
        <MessageToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={1500} // optional
        />
      )}
    </div>
  );
}
