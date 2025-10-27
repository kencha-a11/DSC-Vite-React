// src/api/auth.js
import api, { csrfApi } from "../api/axios";

// Fetch CSRF cookie and wait for it to be set
export const getCsrfCookie = async () => {
  try {
    const response = await csrfApi.get("/sanctum/csrf-cookie");
    
    // Wait a bit to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if cookie was set
    const csrfToken = document.cookie.split(';')
      .find(row => row.trim().startsWith('XSRF-TOKEN='));
    
    if (csrfToken) {
    } else {
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Login
export const login = async (credentials) => {
  
  try {
    // Always fetch fresh CSRF cookie before login
    await getCsrfCookie();
    
    
    const response = await api.post("/login", credentials);
    return response;
  } catch (error) {
    
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    // Get fresh CSRF token for logout too
    await getCsrfCookie();
    const response = await api.post("/logout");
    return response;
  } catch (error) {
    throw error;
  }
};

// Get authenticated user
export const getUser = async () => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    
    throw error;
  }
};

