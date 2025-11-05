import { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../services/profileServices";

export default function useProfileHandler() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "", // ✅ Add role
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /** ✅ Fetch profile */
  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res?.status === "success" && res?.data) {
        setProfile({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          role: res.data.role || "", // ✅ Store role
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to load profile. Please try again.",
      });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Submit updated profile */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await updateUserProfile(profile);
      if (res?.status === "success") {
        setMessage({
          type: "success",
          text: res.message || "Profile updated successfully!",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error updating profile. Please try again.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  /** ✅ Submit password change (admin only) */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    // 🚫 Prevent normal users from changing password
    if (profile.role !== "admin") {
      setMessage({
        type: "error",
        text: "Only administrators are allowed to change passwords.",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await changeUserPassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        confirm_password: passwords.confirm_password,
      });

      if (res?.status === "success") {
        setMessage({
          type: "success",
          text: res.message || "Password changed successfully!",
        });
        setPasswords({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        throw new Error("Password change failed");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error changing password. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    passwords,
    profileLoading,
    passwordLoading,
    message,
    setMessage,
    handleProfileChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit,
  };
}
