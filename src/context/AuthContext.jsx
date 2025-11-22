// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react"; 
// React hooks: createContext for global state, useState for state, useEffect for side effects
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authServices"; 
// Import login/logout/getUser API functions from authServices
import { updateUserProfile as apiUpdateUserProfile } from "../services/profileServices"; 
// Import profile update API function

// ------------------------------
// Create AuthContext for global authentication state
// ------------------------------
const AuthContext = createContext(); 
// Initializes a context object to store auth state (user, loading, error, etc.)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  // Stores currently authenticated user, null if not logged in
  const [loading, setLoading] = useState(true); 
  // Indicates whether auth state is being initialized or an API call is in progress
  const [error, setError] = useState(null); 
  // Holds any authentication-related error messages

  // ------------------------------
  // Fetch user ONLY if session cookie exists (persistent login)
  // ------------------------------
useEffect(() => {
  const initializeAuth = async () => {
    setLoading(true);

    try {
      // 🔥 Always try fetching the user
      const data = await getUser(); // Calls /user with withCredentials
      setUser(data || null); // If session valid, set user
      console.log("✅ User fetched on app load:", data);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("ℹ️ User not authenticated");
      } else {
        console.error("Unexpected error fetching user:", err);
      }
      setUser(null); // Clear user if unauthenticated or error
    } finally {
      setLoading(false); // Done loading
    }
  };

  initializeAuth(); // Run on app startup / refresh
}, []);
  // Empty dependency array ensures this runs only once on mount

  // ------------------------------
  // Login function
  // ------------------------------
  const login = async (credentials) => {
    setError(null); 
    // Clear any previous login errors
    setLoading(true); // Show loading during login
    try {
      await apiLogin(credentials); 
      // Call backend login route (/login), CSRF cookie must already be initialized
      const data = await getUser(); 
      // Fetch authenticated user after successful login
      setUser(data || null); 
      // Update context with logged-in user
      return { success: true }; 
      // Return success for caller to proceed
    } catch (err) {
      const message = err.response?.data?.message || "Login failed"; 
      // Extract error message from backend
      setError(message); 
      setUser(null); 
      // Clear user if login fails
      throw new Error(message); 
      // Throw error so calling component can react
    } finally {
      setLoading(false); // End loading state
    }
  };

  // ------------------------------
  // Logout function
  // ------------------------------
  const logout = async () => {
    setLoading(true); // Show loading during logout
    setError(null); // Clear previous errors
    try {
      await apiLogout(); 
      // Call backend logout route (/logout), removes session
    } catch (err) {
      console.warn("Logout API call failed:", err); 
      // Warn if logout request fails but still clear user
    } finally {
      setUser(null); 
      // Clear user state on logout
      setLoading(false); // End loading
    }
  };

  // ------------------------------
  // Clear error helper
  // ------------------------------
  const clearError = () => setError(null); 
  // Allows consuming components to reset error messages

  // ------------------------------
  // Update user profile
  // ------------------------------
  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await apiUpdateUserProfile(profileData); 
      // Call backend API to update user info
      setUser((prev) => ({ ...prev, ...updatedUser })); 
      // Merge updated fields into existing user object in context
      return { ...user, ...updatedUser }; 
      // Return updated user object for caller
    } catch (err) {
      console.error("Failed to update user profile:", err.response?.data || err); 
      // Log backend error or network error
      throw err; 
      // Bubble error to calling component
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
      {/* Provide auth state and functions to all children */}
    </AuthContext.Provider>
  );
};

// ------------------------------
// Custom hook for consuming AuthContext
// ------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext); 
  // Retrieve context value
  if (!context) throw new Error("useAuth must be used within an AuthProvider"); 
  // Guard against misuse outside provider
  return context; 
  // Return auth state and functions
};
