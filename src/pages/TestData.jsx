// src/pages/TestDataPage.jsx
import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";

export default function TestDataPage() {
  const { data, isLoading, isError, error } = useDashboardData();

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p>Error loading dashboard: {error.message}</p>;

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
