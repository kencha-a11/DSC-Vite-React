// src/components/accounts/AccountList.jsx
import { SettingsIcon } from "../icons";

export default function AccountList({ accounts, selectedUser, onSelectUser }) {
  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  if (!accounts || accounts.length === 0) return <p className="text-gray-500">No matching accounts.</p>;

  return (
    <div className="space-y-3">
      {accounts.map((user) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-2 border rounded-md cursor-pointer 
            ${selectedUser?.id === user.id ? "bg-indigo-50" : "hover:bg-gray-50"}`}
          onClick={() => onSelectUser(user)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
              {getInitial(user.name)}
            </div>
            <span className="text-gray-800 font-medium">{user.name}</span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <SettingsIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
