// src/components/dashboard/DashboardContent.jsx
import React from "react";
import ManagerDashboard from "./manager/ManagerDashboard";
import CashierDashboard from "./cashier/CashierDashboard";
import { useAuth } from "../../context/AuthContext";

export default function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Please log in to view dashboard</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-[91.3vh] overflow-auto">
      {user.role === "admin" ? (
        <ManagerDashboard />
      ) : (
        <CashierDashboard />
      )}
    </div>

  );
}