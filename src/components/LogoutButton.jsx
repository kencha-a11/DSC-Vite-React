import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import LogoutDialog from "./ui/LogoutDialog";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowModal(false);
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

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        disabled={loggingOut}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200
          ${loggingOut ? "text-gray-400 cursor-not-allowed bg-gray-50" : "hover:bg-gray-100"}`}
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>

      {showModal && (
        <LogoutDialog
          message="Logout?"
          subMessage="Are you sure you want to log out?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
}
