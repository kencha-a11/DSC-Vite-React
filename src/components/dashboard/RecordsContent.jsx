import React, { useState } from "react";
import TimeLog from "../records/TimeLog";
import SalesLog from "../records/SalesLog";
import InventoryLog from "../records/InventoryLog";
import ContentTitle from "./ContentTitle";

const RecordsContent = () => {
  const [activeTab, setActiveTab] = useState("time"); // "time", "sales", "inventory"

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded shadow">
      {/* Section A */}
      <ContentTitle Title="Records" />

      {/* Section B */}
      <div className="flex-1 flex flex-col">
        {/* Upper part - tab buttons */}
        <div className="flex justify-center items-center gap-4 p-4 border-b">
          {[
            { key: "time", label: "Time Log" },
            { key: "sales", label: "Sales Log" },
            { key: "inventory", label: "Inventory Log" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lower part - dynamic content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "time" && <TimeLog />}
          {activeTab === "sales" && <SalesLog />}
          {activeTab === "inventory" && <InventoryLog />}
        </div>
      </div>
    </div>
  );
};

export default RecordsContent;
