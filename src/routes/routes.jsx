import React, { lazy } from 'react';
import App from '../App';

// Lazy-load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFoundPage = lazy(() => import('../pages/status/NotFoundPage'));

export const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
];

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
];

export const fallbackRoute = {
  path: '*',
  element: <NotFoundPage />,
};
