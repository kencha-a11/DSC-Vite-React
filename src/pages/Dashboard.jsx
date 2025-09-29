// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* Dynamic content from routes */}
          <Outlet />

          {/* Optional: Welcome user info */}
          {user && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-700">Logged in as: {user.email}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
