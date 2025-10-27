import React, { useState } from "react";
import { createUser } from "../../services/userServices";

export default function AddUserModal({ onClose, onUserAdded, onToast }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user",
    account_status: "activated",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newUser = await createUser(formData);
      onUserAdded(newUser);

      // ✅ show success toast
      onToast?.({ type: "success", text: "User created successfully!" });


      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      // ✅ show error toast
      onToast?.({ type: "error", text: "Failed to create user." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl w-[480px] shadow-lg border-2 border-purple-600">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Account</h2>

          {/* Two-column layout for names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Firstname</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Placeholder"
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Lastname</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Placeholder"
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>
          </div>

          {/* Other fields */}
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Placeholder"
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Placeholder"
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200 bg-white"
                required
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Account Status</label>
              <select
                name="account_status"
                value={formData.account_status}
                onChange={handleChange}
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200 bg-white"
              >
                <option value="activated">Activated</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Placeholder"
                className="w-full border border-purple-600 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between border-t pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
