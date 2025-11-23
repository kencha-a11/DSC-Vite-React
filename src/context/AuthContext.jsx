// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authServices";
import { updateUserProfile as apiUpdateUserProfile } from "../services/profileServices";

// ------------------------------
// Create AuthContext for global authentication state
// ------------------------------
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------
  // Fetch user if token exists in localStorage
  // ------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log("ℹ️ No auth token found");
        setLoading(false);
        return;
      }

      try {
        // Token exists - fetch user
        const data = await getUser();
        setUser(data || null);
        console.log("✅ User fetched on app load:", data);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("ℹ️ Token invalid - clearing storage");
          localStorage.removeItem('auth_token');
        } else {
          console.error("Unexpected error fetching user:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ------------------------------
  // Login function
  // ------------------------------
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiLogin(credentials);
      // response = { user, token, time_log, message }
      setUser(response.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      setUser(null);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Logout function
  // ------------------------------
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // ------------------------------
  // Clear error helper
  // ------------------------------
  const clearError = () => setError(null);

  // ------------------------------
  // Update user profile
  // ------------------------------
  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await apiUpdateUserProfile(profileData);
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return { ...user, ...updatedUser };
    } catch (err) {
      console.error("Failed to update user profile:", err.response?.data || err);
      throw err;
    }
  };

  // ------------------------------
  // Provide AuthContext to all children components
  // ------------------------------
  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, clearError, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ------------------------------
// Custom hook for consuming AuthContext
// ------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};