// src/components/accounts/AccountDashboard.jsx
import React, { useState } from "react";
import { useUsersData } from "../../hooks/useUsersData";
import AccountListPanel from "./AccountListPanel";
import UserLogProfileCard from "./UserLogProfileCard";

export default function AccountDashboard({ users: propUsers }) {
  const { data: fetchedUsers, isLoading } = useUsersData();
  const [selectedUser, setSelectedUser] = useState(null);

  const users = propUsers ?? fetchedUsers; // ✅ Use filtered users if provided
  console.log("AccountDashboard users:", users);

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="flex p-6 h-full">
      <div className="flex-1 h-full overflow-auto">
        <AccountListPanel users={users} onSelectUser={setSelectedUser} />
      </div>
      <div className="w-96 h-full overflow-auto">
        <UserLogProfileCard selectedUser={selectedUser} />
      </div>
    </div>
  );
}
