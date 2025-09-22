// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { fallbackRoute, protectedRoutes, publicRoutes } from './routes/routes';
import "./index.css";

// Map protected routes once outside of createBrowserRouter for clarity
const mappedProtectedRoutes = protectedRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

// Create router with public, protected, and fallback routes
const router = createBrowserRouter([
  ...publicRoutes,
  ...mappedProtectedRoutes,
  fallbackRoute, // catch-all 404 route
]);

// Render application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
