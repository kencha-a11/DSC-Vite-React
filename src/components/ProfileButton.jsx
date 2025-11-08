// src/components/ProfileButton.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileButton() {
  const { user, loading } = useAuth();

  // Display name dynamically
  const displayName = user
    ? user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "Firstname Lastname";

  // Compute initials dynamically
  const initials = (() => {
    if (!user) return "??";

    const f = (user.first_name || "").trim();
    const l = (user.last_name || "").trim();
    if (f || l) return `${(f[0] || "").toUpperCase()}${(l[0] || "").toUpperCase()}`;

    const nm = (user.name || "").trim();
    const parts = nm.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  })();

  const avatarUrl = user && (user.avatar || user.profileImage || user.profile_image);

  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-pink-50 border border-pink-400 text-black rounded-full px-4 py-2">
        <div className="w-8 h-8 rounded-full bg-white/80 border border-pink-300 flex items-center justify-center text-sm font-semibold">
          ...
        </div>
        <span className="text-base font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <NavLink
      to="/dashboard/profile"
      className={({ isActive }) =>
        [
          "flex items-center gap-3 bg-pink-50 border border-pink-400 text-black rounded-full px-4 py-[7px] transition-colors duration-200",
          isActive ? "bg-pink-100" : "hover:bg-pink-100",
        ].join(" ")
      }
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover border border-pink-300"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-pink-300 text-sm font-semibold text-black">
          {initials}
        </div>
      )}
      <span className="text-base font-medium truncate">{displayName}</span>
    </NavLink>
  );
}
