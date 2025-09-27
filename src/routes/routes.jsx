import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
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
      { index: true, element: <Navigate to="/home" replace /> },
      { path: '/home', element: <HomePage /> },
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
