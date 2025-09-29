// src/routes/routes.jsx
import { lazy } from "react";
import App from "../App";
import ProtectedRoute from "../routes/ProtectedRoute"

// Lazily load route components (code-splitting for performance)
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFoundPage = lazy(() => import("../pages/status/NotFoundPage"));

const DashboardContent = lazy(() => import("../components/dashboard/DashboardContent"));
const AccountsContent = lazy(() => import("../components/dashboard/AccountsContent"));
const SellContent = lazy(() => import("../components/dashboard/SellContent"));
const InventoryContent = lazy(() => import("../components/dashboard/InventoryContent"));
const RecordsContent = lazy(() => import("../components/dashboard/RecordsContent"));
const ReportsContent = lazy(() => import("../components/dashboard/ReportsContent"));

// Public routes: accessible without authentication
export const publicRoutes = [
  {
    path: "/",
    element: <App />, // App provides layout/wrapper for routes
    children: [
      { index: true, element: <HomePage /> }, // default route at "/"
      { path: "home", element: <HomePage /> }, // "/home" route
      { path: "login", element: <LoginPage /> }, // "/login" route
    ],
  },
];

// Protected routes: only accessible when authenticated
export const protectedRoutes = [
  {
    path: "/",
    element: <App />, // Wrap protected routes in App for consistent layout
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardContent /> },
          { path: "accounts", element: <AccountsContent /> },
          { path: "sell", element: <SellContent /> },
          { path: "inventory", element: <InventoryContent /> },
          { path: "records", element: <RecordsContent /> },
          { path: "reports", element: <ReportsContent /> },
        ],
      },
      // Add more protected routes here as needed
    ],
  },
];

// Fallback route: catches all undefined paths and shows a 404 page
export const fallbackRoute = {
  path: "*",
  element: <NotFoundPage />,
};
