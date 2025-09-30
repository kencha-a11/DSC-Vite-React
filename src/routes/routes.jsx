// src/routes/routes.jsx (The Cleanest Version)

// Note: Remove 'lazy' and 'Suspense' imports as they are now in utils.jsx
import App from "../App";
import ProtectedRoute from "../routes/ProtectedRoute";
import { wrapRouteElement } from "../utils/utils"; // Import the helper function

// 🤩 Single, clean import from the centralized loader file
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
  loadTestDataPage
} from "../pages";

// **STEP ELIMINATED:** The block of 'const HomePage = lazy(loadHomePage);' is no longer necessary.

// Public routes: accessible without authentication
export const publicRoutes = [
  {
    path: "/",
    element: <App />, 
    children: [
      { 
        index: true, 
        element: wrapRouteElement(loadHomePage) 
      }, 
      { 
        path: "home", 
        element: wrapRouteElement(loadHomePage) 
      }, 
      { 
        path: "login", 
        element: wrapRouteElement(loadLoginPage) 
      },
      // You can add TestDataPage here if it's public
      {
        path: "test-data",
        element: wrapRouteElement(loadTestDataPage)
      }
    ],
  },
];

// Protected routes: only accessible when authenticated
export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard",
        // The Dashboard component needs to be lazily loaded inside ProtectedRoute
        element: (
          <ProtectedRoute>
            {wrapRouteElement(loadDashboard)}
          </ProtectedRoute>
        ),
        children: [
          // Nested routes also use the helper
          { index: true, element: wrapRouteElement(loadDashboardContent) },
          { path: "accounts", element: wrapRouteElement(loadAccountsContent) },
          { path: "sell", element: wrapRouteElement(loadSellContent) },
          { path: "inventory", element: wrapRouteElement(loadInventoryContent) },
          { path: "records", element: wrapRouteElement(loadRecordsContent) },
          { path: "reports", element: wrapRouteElement(loadReportsContent) },
        ],
      },
    ],
  },
];

// Fallback route: catches all undefined paths and shows a 404 page
export const fallbackRoute = {
  path: "*",
  element: wrapRouteElement(loadNotFoundPage), // 🔥 Uses the helper
};