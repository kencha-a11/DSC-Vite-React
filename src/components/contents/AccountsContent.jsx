// src/components/dashboard/AccountsContent.jsx
import { useState } from "react";
import ContentTitle from "./ContentTitle";
import SearchBar from "../accounts/SearchBar";
import AccountList from "../accounts/AccountList";
import AccountDetails from "../accounts/AccountDetails";
import { useUsersData } from "../../hooks/useUsersData";

export default function AccountsContent() {
  const { data, isLoading, isError, error } = useUsersData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredAccounts = (data || []).filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading accounts...</p>;
  if (isError) return <p>Error loading accounts: {error.message}</p>;


  return (
    <div className="p-6 bg-white rounded-md shadow w-full">
      <ContentTitle Title="Accounts" />

      <div className="flex gap-6">
        <div className="w-1/2 border-r pr-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
          <AccountList
            accounts={filteredAccounts}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>

        <div className="flex-1">
          <AccountDetails user={selectedUser} />
        </div>
      </div>
    </div>
  );
}
