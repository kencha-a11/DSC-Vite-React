// src/components/accounts/AccountDetails.jsx
import { PlusIcon, PencilIcon, LockIcon, RemoveIcon } from "../icons";
import SalesList from "./SalesList";

export default function AccountDetails({ user }) {
  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  if (!user) return <p className="text-gray-500">Select an account to view details</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Part */}
      <div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">
          <PlusIcon className="w-5 h-5 text-indigo-600" />
          <span className="text-gray-700 font-medium">Account</span>
        </button>
      </div>

      {/* Middle Part - User Info */}
      <div className="flex items-center gap-4 p-4 border rounded-md">
        <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-2xl">
          {getInitial(user.name)}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">{user.name}</span>
          <div className="flex gap-3 mt-1 text-gray-500">
            <button className="hover:text-indigo-600">
              <PencilIcon />
            </button>
            <button className="hover:text-indigo-600">
              <LockIcon />
            </button>
            <button className="hover:text-red-600">
              <RemoveIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Lower Part - Sales Transactions */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm font-medium border-b pb-2">
          <span className="text-indigo-600 cursor-pointer">Time Logs</span>
          <span className="text-gray-600 cursor-pointer">Transaction</span>
        </div>

        <SalesList sales={user.sales} />

        <div className="text-sm text-indigo-600 font-medium cursor-pointer">
          Sales record &gt;&gt;
        </div>
      </div>
    </div>
  );
}
