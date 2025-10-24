// src/components/LogoutButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logout();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/home", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200
        ${
          loggingOut
            ? "text-gray-400 cursor-not-allowed bg-gray-50"
            : "hover:bg-gray-100"
        }`}
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
