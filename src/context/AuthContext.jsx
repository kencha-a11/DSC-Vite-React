// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authServices";
import { updateUserProfile as apiUpdateUserProfile } from "../services/profileServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const data = await getUser();
        setUser(data || null);
      } catch (err) {
        setUser(null);
        if (err.response?.status !== 401) {
          console.error("Unexpected error fetching user:", err);
          setError("Failed to fetch user data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      await apiLogin(credentials);
      const data = await getUser();
      setUser(data || null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      setUser(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout API call failed:", err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  /** ✅ Update user profile and immediately reflect changes in all components */
  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await apiUpdateUserProfile(profileData);
      // Replace the user reference completely so React re-renders components
      setUser({ ...user, ...updatedUser });
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

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
