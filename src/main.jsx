import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { initCsrf } from "./api/axios";
import { AuthProvider } from "./context/AuthContext";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routes/routes";
import Loader from "./components/Loader";
import "./index.css";


const startApp = async () => {
  // Wait for CSRF cookie to be set before mounting the app
  await initCsrf();

  const queryClient = new QueryClient();
  const root = document.getElementById("root");
  if (!root) throw new Error('Missing <div id="root"></div> in index.html');

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    fallbackRoute,
  ]);

  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loader text="Loading app…" />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
};

// Start the app
startApp();
