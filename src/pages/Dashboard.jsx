// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/contents/SideBar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar component*/}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-8xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
