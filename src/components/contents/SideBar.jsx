// src/components/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import TimeDisplay from "../TimeDisplay";
import Logo from "../../assets/logo.png";

import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountsIcon from '@mui/icons-material/AssignmentInd';
import InventoryIcon from '@mui/icons-material/ViewInAr';
import RecordsIcon from '@mui/icons-material/Assignment';
import SellIcon from '@mui/icons-material/AttachMoney';

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", to: "/dashboard", Icon: DashboardIcon, roles: ["cashier", "manager"] },
  { name: "Accounts", to: "/dashboard/accounts", Icon: AccountsIcon, roles: ["manager"] },
  { name: "Sells", to: "/dashboard/sell", Icon: SellIcon, roles: ["cashier"] },
  { name: "Inventory", to: "/dashboard/inventory", Icon: InventoryIcon, roles: ["manager"] },
  { name: "Records", to: "/dashboard/records", Icon: RecordsIcon, roles: ["manager"] },
];

export default function Sidebar() {
  const location = useLocation();
  const indicatorRef = useRef(null);
  const { user } = useAuth();

  // Map user.role to menu roles
  const userRole =
    user?.role === "admin"
      ? "manager"
      : user?.role === "user"
      ? "cashier"
      : user?.role;

  // Filter menu items based on user role
  const visibleMenuItems = user
    ? menuItems.filter((item) => item.roles.includes(userRole))
    : [];

  const [activeIndex, setActiveIndex] = useState(
    visibleMenuItems.findIndex((item) =>
      location.pathname.startsWith(item.to)
    )
  );

  // Update active index on route change
  useEffect(() => {
    const index = visibleMenuItems.reduce((bestIndex, item, i) => {
      if (location.pathname.startsWith(item.to)) {
        if (
          bestIndex === -1 ||
          item.to.length > visibleMenuItems[bestIndex].to.length
        ) {
          return i;
        }
      }
      return bestIndex;
    }, -1);
    setActiveIndex(index);
  }, [location.pathname, visibleMenuItems]);

  // Update indicator position and height dynamically
  useEffect(() => {
    if (indicatorRef.current && activeIndex !== -1) {
      const menuItem = document.querySelectorAll("nav ul li")[activeIndex];
      if (menuItem) {
        const top = menuItem.offsetTop;
        const height = menuItem.offsetHeight;
        indicatorRef.current.style.transform = `translateY(${top}px)`;
        indicatorRef.current.style.height = `${height}px`;
      }
    }
  }, [activeIndex]);

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 hidden md:flex flex-col text-black">
      {/* Top brand/title */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <img src={Logo} alt="DSC Souvenirs Logo" className="w-10 h-10" />
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-black">DSC Souvenirs</span>
          {user && (
            <span className="text-sm font-medium text-pink-500 capitalize">
              {user.role === "user"
                ? "Cashier"
                : user.role === "admin"
                ? "Manager"
                : user.role}
            </span>
          )}
        </div>
      </div>

      <div className="px-2 pt-4">
        <TimeDisplay />
      </div>

      {/* Navigation */}
      <nav className="relative py-4 flex-1" aria-label="Main navigation">
        {/* Slider indicator */}
        <span
          ref={indicatorRef}
          className="absolute w-full bg-pink-100 transition-transform duration-300 ease-in-out pointer-events-none z-0"
          style={{ transform: "translateY(0)" }}
        >
          <span className="absolute top-0 left-0 h-full w-1 bg-pink-600" />
        </span>

        <ul className="space-y-1 relative z-10">
          {visibleMenuItems.map(({ name, to, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 relative",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
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
