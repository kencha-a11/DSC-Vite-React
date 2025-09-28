// src/main.jsx
import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routes/routes";
import Loader from "./components/Loader";
import "./index.css";

// Get the root DOM element where the React app will be mounted
const root = document.getElementById("root");
// Throw an error if #root is missing from index.html
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
    {/* Enables additional checks and warnings in development mode */}
    <AuthProvider> 
      {/* Provides authentication context to the entire app */}
      <Suspense
        // Fallback UI shown while lazy-loaded components are being fetched
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader text="Loading app…" />
          </div>
        }
      >
        {/* Provides router context for navigation */}
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </StrictMode>
);
