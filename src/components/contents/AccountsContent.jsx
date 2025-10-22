import { useState } from "react";
import { useUsersData } from "../../hooks/useUsersData";
import AccountListPanel from "../accounts/AccountListPanel";
import UserLogProfileCard from "../accounts/UserLogProfileCard";

export default function AccountsContent() {
  const { data, isLoading, isError, error } = useUsersData();
  console.log("AccountsContent - fetched users data:", data);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Safely handle missing data + combine first and last name for search
  const filteredAccounts = (data || []).filter((user) => {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) return <p>Loading accounts...</p>;
  if (isError) return <p>Error loading accounts: {error.message}</p>;

return (
<div className="flex flex-col h-[86vh] overflow-hidden bg-gray-50">
    {/* Main content area fills remaining space */}
    <div className="flex flex-1 overflow-hidden gap-8">
      {/* Left - Account List */}
      {/* ADDED: overflow-y-auto to enable vertical scrolling for the list */}
      <div className="flex-1 overflow-y-auto"> 
        <AccountListPanel users={filteredAccounts} onSelectUser={setSelectedUser} />
      </div>

      {/* Right - User Profile Logs */}
      {/* ADDED: overflow-y-auto to enable vertical scrolling for the profile/logs */}
      <div className="w-96 flex-shrink-0 overflow-y-auto"> 
        <UserLogProfileCard selectedUser={selectedUser} />
      </div>
    </div>
</div>
);
}
