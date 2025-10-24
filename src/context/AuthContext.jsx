// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authServices";

// Create a React Context for authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Holds the authenticated user object (or null if not logged in)
  const [user, setUser] = useState(null);
  // Indicates if authentication-related data is still loading
  const [loading, setLoading] = useState(true);
  // Stores any authentication-related error messages
  const [error, setError] = useState(null);

  // On mount, attempt to fetch the current user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const data = await getUser(); // API call to get user info
        setUser(data);
      } catch (err) {
        setUser(null);
        // If it's a 401, it just means no active session (not an actual error)
        if (err.response?.status === 401) {
        } else {
          console.error("Unexpected error fetching user:", err);
          setError("Failed to fetch user data");
        }
      } finally {
        setLoading(false); // Always stop loading after attempt
      }
    };
    fetchUser();
  }, []);

  // Login method: calls API, fetches user, updates state
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      await apiLogin(credentials); // Send login request
      const data = await getUser(); // Fetch updated user
      setUser(data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      setUser(null);
      throw new Error(errorMessage); // Propagate error for UI handling
    } finally {
      setLoading(false);
    }
  };

  // Logout method: attempts server-side logout, then clears local state
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout API call failed:", err);
      // Even if API fails, clear local session
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // Utility function: clear error state
  const clearError = () => setError(null);

  // Provide authentication state and methods to the rest of the app
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
