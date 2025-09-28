// src/routes/routes.jsx
import { lazy } from "react";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazily load route components (code-splitting for performance)
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFoundPage = lazy(() => import("../pages/status/NotFoundPage"));

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
