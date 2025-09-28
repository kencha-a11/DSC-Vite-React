// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  // Get current user and loading state from AuthContext
  const { user, loading } = useAuth();

  // Capture the current location (so we can redirect back after login if needed)
  const location = useLocation();

  // While checking authentication status, show a loader
  if (loading) return <Loader text="Checking auth…" />;

  // If no user is logged in, redirect to /home (or login page)
  // `state.from` stores the attempted location for post-login redirect
  if (!user) return <Navigate to="/home" state={{ from: location }} replace />;

  // If user is authenticated, render the protected content
  return children;
}
