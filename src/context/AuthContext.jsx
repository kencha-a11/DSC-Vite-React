// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authServices";
import { updateUserProfile as apiUpdateUserProfile } from "../services/profileServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------------------
  // Fetch user ONLY if session cookie exists
  // ------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // 🔥 Only real login cookie determines auth state
      const hasSession = document.cookie
        .split("; ")
        .some((c) => c.startsWith("laravel_session="));

      if (!hasSession) {
        console.log("ℹ️ No session cookie — user is not logged in");
        setUser(null);
        setLoading(false);
        return;
      }

      // ✔ A session exists → fetch authenticated user
      try {
        const data = await getUser();
        setUser(data || null);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Unexpected error fetching user:", err);
          setError("Failed to fetch user data");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ------------------------------
  // Login
  // ------------------------------
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      await apiLogin(credentials);
      const data = await getUser();
      setUser(data || null);
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
  // Logout
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
  // Clear error
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

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, clearError, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ------------------------------
// Custom hook
// ------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
