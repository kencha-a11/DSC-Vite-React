// src/main.jsx
import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routes/routes";
import Loader from "./components/Loader";
import "./index.css";

// 🔹 React Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a QueryClient instance (manages cache, retries, etc.)
const queryClient = new QueryClient();

// Get the root DOM element where the React app will be mounted
const root = document.getElementById("root");
if (!root) throw new Error('Missing <div id="root"></div> in index.html');

// Create a router configuration by combining public, protected, and fallback routes
const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  fallbackRoute,
]);

// Render the React app into the DOM
createRoot(root).render(
  <StrictMode>
    {/* 🔹 React Query global provider */}
    <QueryClientProvider client={queryClient}>
      {/* 🔹 Your Auth Context (user state, login, logout, etc.) */}
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Loader text="Loading app…" />
            </div>
          }
        >
          {/* 🔹 Provides router context for navigation */}
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>

      {/* 🔹 Optional devtools (floating React Query inspector) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
