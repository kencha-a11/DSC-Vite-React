// src/pages/Dashboard.jsx
import { Outlet, useMatches } from "react-router-dom";
import Sidebar from "../components/contents/SideBar";
import ContentTitle from "../components/contents/ContentTitle";

export default function Dashboard() {
  // Get all matched routes
  const matches = useMatches();

  // Find the deepest one with a `handle.title`
  const current = matches.reverse().find((m) => m.handle?.title);
  const title = current?.handle?.title || "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar component*/}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
          <ContentTitle Title={title} />
        <div className="max-w-8xl mx-auto max-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
