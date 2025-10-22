// src/routes/routes.jsx

import App from "../App";
import ProtectedRoute from "../routes/ProtectedRoute";
import { wrapRouteElement } from "../utils/utils";
import {
  loadHomePage,
  loadLoginPage,
  loadDashboard,
  loadNotFoundPage,
  loadDashboardContent,
  loadAccountsContent,
  loadSellContent,
  loadInventoryContent,
  loadRecordsContent,
  loadReportsContent,
  loadTestDataPage,
} from "../pages";

// ✅ Public routes
export const publicRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: wrapRouteElement(loadHomePage) },
      { path: "home", element: wrapRouteElement(loadHomePage) },
      { path: "login", element: wrapRouteElement(loadLoginPage) },
      { path: "test-data", element: wrapRouteElement(loadTestDataPage) },
    ],
  },
];

// ✅ Protected routes (Dashboard)
export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            {wrapRouteElement(loadDashboard)}
          </ProtectedRoute>
        ),
        children: [
          { 
            index: true, 
            element: wrapRouteElement(loadDashboardContent),
            handle: { title: "Dashboard" },
          },
          { 
            path: "accounts", 
            element: wrapRouteElement(loadAccountsContent),
            handle: { title: "Accounts" },
          },
          { 
            path: "sell", 
            element: wrapRouteElement(loadSellContent),
            handle: { title: "Sell" },
          },
          { 
            path: "inventory", 
            element: wrapRouteElement(loadInventoryContent),
            handle: { title: "Inventory" },
          },
          { 
            path: "records", 
            element: wrapRouteElement(loadRecordsContent),
            handle: { title: "Records" },
          },
          { 
            path: "reports", 
            element: wrapRouteElement(loadReportsContent),
            handle: { title: "Reports" },
          },
        ],
      },
    ],
  },
];

// Fallback route
export const fallbackRoute = {
  path: "*",
  element: wrapRouteElement(loadNotFoundPage),
};
