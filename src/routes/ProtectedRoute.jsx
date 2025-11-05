import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show a loader
  if (loading) return <Loader text="Loading..." size="lg" overlay />;

  // If user is not logged in → redirect to login or home
  if (!user) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and authorized, if roles matched)
  return children;
}
