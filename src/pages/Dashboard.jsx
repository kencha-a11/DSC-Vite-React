// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with logout */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                text-sm font-medium rounded-md text-white bg-red-600 
                hover:bg-red-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

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
