// src/components/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LogoutButton from "../LogoutButton"; // 👈 Import the new component
import TimeDisplay from "../TimeDisplay";
import {
  DashboardIcon,
  AccountsIcon,
  SellIcon,
  InventoryIcon,
  RecordsIcon,
  ReportsIcon,
} from "../icons/index";

const menuItems = [
  { name: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
  { name: "Accounts", to: "/dashboard/accounts", Icon: AccountsIcon },
  { name: "Sells", to: "/dashboard/sell", Icon: SellIcon },
  { name: "Inventory", to: "/dashboard/inventory", Icon: InventoryIcon },
  { name: "Records", to: "/dashboard/records", Icon: RecordsIcon },
  { name: "Reports", to: "/dashboard/reports", Icon: ReportsIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const indicatorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(
    menuItems.findIndex((item) => location.pathname.startsWith(item.to))
  );

  useEffect(() => {
    const index = menuItems.reduce((bestIndex, item, i) => {
      if (location.pathname.startsWith(item.to)) {
        if (bestIndex === -1 || item.to.length > menuItems[bestIndex].to.length) {
          return i;
        }
      }
      return bestIndex;
    }, -1);
    setActiveIndex(index);
  }, [location.pathname]);

  useEffect(() => {
    if (indicatorRef.current && activeIndex !== -1) {
      indicatorRef.current.style.transform = `translateY(${activeIndex * 48}px)`;
    }
  }, [activeIndex]);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 hidden md:flex flex-col text-black">
      {/* Top brand/title */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        {/* Logo */}
        <img
          src="/assets/logo.png" // 👈 replace with your actual logo path
          alt="DSC Souvenirs Logo"
          className="w-10 h-10"
        />

        {/* Text section */}
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-black">DSC Souvenirs</span>
          <span className="text-sm font-medium text-pink-500">Cashier</span>
        </div>
      </div>

      <div className="px-2 pt-4">
        <TimeDisplay />
      </div>

      {/* Navigation */}
      <nav className="relative px-2 py-4 flex-1" aria-label="Main navigation">
        <span
          ref={indicatorRef}
          className="absolute left-2 w-[calc(100%-1rem)] h-12 bg-gray-100 rounded-md transition-transform duration-300 ease-in-out pointer-events-none"
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
                    "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive ? "bg-gray-100" : "hover:bg-gray-50",
                  ].join(" ")
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>

  );
}
