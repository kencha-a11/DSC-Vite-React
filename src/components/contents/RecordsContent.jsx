import React, { useState } from "react";
import TimeLog from "../records/TimeLog";
import SalesLog from "../records/SalesLog";
import InventoryLog from "../records/InventoryLog";

const tabs = [
  { key: "time", label: "Time log" },
  { key: "sales", label: "Sales log" },
  { key: "inventory", label: "Inventory log" },
];

const RecordsContent = () => {
  const [activeTab, setActiveTab] = useState("time");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-lg shadow p-4">
      {/* Tab Header */}
      <div className="relative flex justify-between border border-gray-200 rounded-t-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-1 py-3 text-center font-medium transition-colors duration-300 ${
              activeTab === tab.key
                ? "text-black bg-fuchsia-50"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Sliding indicator */}
        <div
          className={`absolute bottom-0 h-1 bg-fuchsia-600 rounded-t transition-all duration-300`}
          style={{
            width: `${100 / tabs.length}%`,
            left: `${tabs.findIndex((t) => t.key === activeTab) * (100 / tabs.length)}%`,
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto border border-gray-200">
        {activeTab === "time" && <TimeLog />}
        {activeTab === "sales" && <SalesLog />}
        {activeTab === "inventory" && <InventoryLog />}
      </div>
    </div>
  );
};

export default RecordsContent;
