// src/api/auth.js
import api, { csrfApi } from "../api/axios";

// Get authenticated user
export async function getUserProfile() {
  try {
    const { data } = await api.get("/user/profile");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function changeUserPassword(passwordData) {
  try {
    const response = await api.put("/user/profile/password", {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
      new_password_confirmation: passwordData.confirm_password, // ✅ must match
    });
    return response.data;
  } catch (error) {
    console.error("Password update failed:", error.response?.data || error);
    throw error;
  }
}
