// src/main.jsx
import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { fallbackRoute, protectedRoutes, publicRoutes } from './routes/routes';
import Loader from './components/Loader';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing <div id="root"></div> in index.html');
}

const mappedProtectedRoutes = protectedRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

const router = createBrowserRouter([
  ...publicRoutes,
  ...mappedProtectedRoutes,
  fallbackRoute,
]);

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader text="Loading app…" /></div>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </StrictMode>
);
