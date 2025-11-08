// src/components/ProfileContent.jsx
import React from "react";
import useProfileHandler from "./useProfileHandler"; // ✅ updated path
import MessageToast from "../MessageToast"; // ✅ updated path

export default function ProfileContent() {
  const {
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
  } = useProfileHandler();

  return (
    <>
      <MessageToast message={message} onClose={() => setMessage(null)} />

      <main className="w-full min-h-[calc(100vh-64px)] p-4 bg-gray-50 overflow-y-auto">
        <div className="mx-auto space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-gray-200 px-8 py-4 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your account’s profile information.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">First name</label>
                  <input
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleProfileChange}
                    type="text"
                    placeholder="John"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Last name</label>
                  <input
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleProfileChange}
                    type="text"
                    placeholder="Doe"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Phone number</label>
                <input
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleProfileChange}
                  type="tel"
                  placeholder="09453748272"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  type="email"
                  placeholder="johndoe@gmail.com"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="pt-4 flex justify-start">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex justify-center rounded-md bg-fuchsia-700 px-6 py-2 text-sm font-medium text-white hover:bg-fuchsia-800 focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-50"
                >
                  {profileLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section (Admin Only) */}
          {profile.role === "admin" && (
            <section className="bg-white rounded-2xl border border-gray-200 px-8 py-4 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Password</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ensure your account is using a long, random password.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <input
                  type="password"
                  name="current_password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
                />
                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
                />
                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
                />

                <div className="pt-4 flex justify-start">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex justify-center rounded-md bg-fuchsia-700 px-6 py-2 text-sm font-medium text-white hover:bg-fuchsia-800 focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-50"
                  >
                    {passwordLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>

      <footer className="bg-gray-200 py-4 w-full">
        <div className="text-center text-sm text-gray-700">
          &copy; 2025 DSC Souvenirs. All rights reserved.
        </div>
      </footer>
    </>
  );
}
