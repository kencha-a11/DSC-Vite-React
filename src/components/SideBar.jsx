import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// Inline SVG icons (same as yours)
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12v7a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
    <path d="M5 12h14l-1 6H6l-1-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProductsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InventoryIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="13" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ReportsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


// icons (same as before)...

const menuItems = [
  { name: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
  { name: "Sell", to: "/dashboard/sell", Icon: SellIcon },
  { name: "Products", to: "/dashboard/products", Icon: ProductsIcon },
  { name: "Inventory", to: "/dashboard/inventory", Icon: InventoryIcon },
  { name: "Reports", to: "/dashboard/reports", Icon: ReportsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r dark:bg-slate-800 dark:border-slate-700 hidden md:flex flex-col">
      {/* Top brand/title */}
      <div className="px-6 py-5 border-b dark:border-slate-700 flex items-center gap-3">
        {/* Circle logo container */}
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          D
        </div>

        {/* Brand name */}
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          DSC Souvenirs
        </h1>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 flex-1" aria-label="Main navigation">
        <ul className="space-y-1">
          {menuItems.map(({ name, to, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end // <-- important: makes sure only exact path matches
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-md transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50",
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

      {/* Footer */}
      <div className="px-6 py-4 border-t text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        © 2025 DSC
      </div>
    </aside>
  );
}
