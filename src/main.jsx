import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routes/routes";
import Loader from "./components/Loader";
import "./index.css";

// Initialize QueryClient
const queryClient = new QueryClient();

// Get root element
const root = document.getElementById("root");
if (!root) throw new Error('Missing <div id="root"></div> in index.html');

// Create router
const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  fallbackRoute,
]);

// Render app immediately (no CSRF wait needed for token-based auth)
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense
          fallback={
            <Loader text="Loading..." />
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);