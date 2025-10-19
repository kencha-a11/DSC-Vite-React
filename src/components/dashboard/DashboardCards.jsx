import React from "react";
import StatCard from "./StatCard";

const DashboardCards = ({ stats }) => {
  if (!stats || stats.length === 0) return <p>Loading metrics...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
