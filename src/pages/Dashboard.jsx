// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails, redirect to home
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
            
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <h2 className="text-lg font-medium text-blue-900 mb-2">
                  Welcome back!
                </h2>
                <p className="text-blue-700">
                  Email: {user.email}
                </p>
                {user.name && (
                  <p className="text-blue-700">
                    Name: {user.name}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Test Component 1
                </h3>
                <p className="text-gray-600">
                  This is a placeholder component for your dashboard.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Test Component 2
                </h3>
                <p className="text-gray-600">
                  Add your own components here as needed.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Test Component 3
                </h3>
                <p className="text-gray-600">
                  Components will render here based on user permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}