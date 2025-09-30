// src/components/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DashboardIcon, AccountsIcon, SellIcon, InventoryIcon, RecordsIcon, ReportsIcon } from "../icons/index"


// --- Menu items ---
const menuItems = [
  { name: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
  { name: "Accounts", to: "/dashboard/accounts", Icon: AccountsIcon },
  { name: "Sells", to: "/dashboard/sell", Icon: SellIcon },
  { name: "Inventory", to: "/dashboard/inventory", Icon: InventoryIcon },
  { name: "Records", to: "/dashboard/records", Icon: RecordsIcon },
  { name: "Reports", to: "/dashboard/reports", Icon: ReportsIcon },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return; // safeguard
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

  // --- Active link indicator animation ---
  const indicatorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(
    menuItems.findIndex((item) => location.pathname.startsWith(item.to))
  );

  useEffect(() => {
    const index = menuItems.reduce((bestIndex, item, i) => {
      if (location.pathname.startsWith(item.to)) {
        // pick the longer path (more specific)
        if (
          bestIndex === -1 ||
          item.to.length > menuItems[bestIndex].to.length
        ) {
          return i;
        }
      }
      return bestIndex;
    }, -1);

    setActiveIndex(index);
  }, [location.pathname]);


  useEffect(() => {
    if (indicatorRef.current && activeIndex !== -1) {
      indicatorRef.current.style.transform = `translateY(${activeIndex * 48}px)`; // 48px = link height
    }
  }, [activeIndex]);

  return (
    <aside className="w-64 min-h-screen bg-white border-r dark:bg-slate-800 dark:border-slate-700 hidden md:flex flex-col">
      {/* Top brand/title */}
      <div className="px-6 py-5 border-b dark:border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          D
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          DSC Souvenirs
        </h1>
      </div>

      {/* Navigation with animated indicator */}
      <nav className="relative px-2 py-4 flex-1" aria-label="Main navigation">
        {/* Active indicator */}
        <span
          ref={indicatorRef}
          className="absolute left-2 w-[calc(100%-1rem)] h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-md transition-transform duration-300 ease-in-out pointer-events-none"
          style={{ transform: "translateY(0)" }}
        />
        <ul className="space-y-1 relative">
          {menuItems.map(({ name, to, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 relative",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50",
                  ].join(" ")
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with copyright + logout */}
      <div className="mt-auto border-t dark:border-slate-700">
        <div className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 text-center">
          © 2025 DSC
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200
            ${loggingOut
              ? "text-gray-400 cursor-not-allowed bg-gray-50 dark:bg-slate-700"
              : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
            }`}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
