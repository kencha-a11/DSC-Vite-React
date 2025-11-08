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
  // loadReportsContent,
  loadProfileContent,
  loadForbiddenPage
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
      { path: "unauthorized", element: wrapRouteElement(loadForbiddenPage)},
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
          <ProtectedRoute roles={["admin", "user"]}>
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
            element: (
              <ProtectedRoute roles={["admin"]}>
                {wrapRouteElement(loadAccountsContent)}
              </ProtectedRoute>
            ),
            handle: { title: "Accounts" },
          },
          {
            path: "sell",
            element: (
              <ProtectedRoute roles={["user"]}>
                {wrapRouteElement(loadSellContent)}
              </ProtectedRoute>
            ),
            handle: { title: "Sell" },
          },
          {
            path: "inventory",
            element: (
              <ProtectedRoute roles={["admin"]}>
                {wrapRouteElement(loadInventoryContent)}
              </ProtectedRoute>
            ),
            handle: { title: "Inventory" },
          },
          {
            path: "records",
            element: (
              <ProtectedRoute roles={["admin"]}>
                {wrapRouteElement(loadRecordsContent)}
              </ProtectedRoute>
            ),
            handle: { title: "Records" },
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute roles={["admin", "user"]}>
                {wrapRouteElement(loadProfileContent)}
              </ProtectedRoute>
            ),
            handle: { title: "Profile" },
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
