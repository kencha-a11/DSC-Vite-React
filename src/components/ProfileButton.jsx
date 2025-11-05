// src/components/ProfileButton.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUser } from "../services/authServices";

export default function ProfileButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const data = await getUser();
        if (mounted) {
          setUser(data || null);
        }
      } catch (err) {
        console.error("getUser failed:", err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName =
    (user && (user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim())) ||
    "Firstname Lastname";

  const initials = (() => {
    if (!user) return "??";
    const f = (user.first_name || "").trim();
    const l = (user.last_name || "").trim();
    if (f || l) {
      return `${(f[0] || "").toUpperCase()}${(l[0] || "").toUpperCase()}` || "U";
    }
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
