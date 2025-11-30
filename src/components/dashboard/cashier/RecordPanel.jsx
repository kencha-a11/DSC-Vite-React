import React, { useState } from "react";
import { TimeLogTable } from "./TimeLogTable";
import { SalesLogTable } from "./SalesLogTable";

export const RecordPanel = ({
  // Time Logs Props
  timeLogs = [],
  timeLogsMeta = {},
  loadingTimeLogs = false,
  loadMoreTimeLogs,
  timeLogsRef,
  sentinelRef,              // ✅ TIME LOGS sentinel ref
  setTimeLogsDateFilter,

  // Sales Logs Props
  salesLogs = [],
  salesLogsMeta = {},
  loadingSalesLogs = false,
  loadMoreSalesLogs,
  salesLogsRef,
  sentinelRefSales,         // ✅ SALES LOGS sentinel ref
  setSalesLogsDateFilter,
}) => {
  const [activeTab, setActiveTab] = useState("timeLogs");
  const [dateFilter, setDateFilter] = useState("");

  // Update the appropriate filter when date changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDateFilter(newDate);
    
    // Update both filters so switching tabs maintains the selected date
    setTimeLogsDateFilter(newDate);
    setSalesLogsDateFilter(newDate);
  };

  const tabs = [
    { id: "timeLogs", label: "Time logs" },
    { id: "salesLog", label: "Sales log" },
  ];

  return (
    <div className="w-full flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-[72vh]">
      
      {/* Header with Date Picker */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-none gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">Records</h2>

        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-200 flex-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`w-1/2 relative p-4 text-center text-base font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-fuchsia-700 bg-fuchsia-50"
                : "text-gray-500 bg-white hover:bg-gray-50"
            } focus:outline-none`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-fuchsia-700 rounded-t-sm"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "timeLogs" && (
          <TimeLogTable
            data={timeLogs}
            loading={loadingTimeLogs}
            loadMoreTimeLogs={loadMoreTimeLogs}
            meta={timeLogsMeta}
            scrollRef={timeLogsRef}
            sentinelRef={sentinelRef}        // ✅ FIXED: Pass time logs sentinel
            dateFilter={dateFilter}
          />
        )}

        {activeTab === "salesLog" && (
          <SalesLogTable
            data={salesLogs}
            loading={loadingSalesLogs}
            loadMoreSalesLogs={loadMoreSalesLogs}
            meta={salesLogsMeta}
            scrollRef={salesLogsRef}
            sentinelRef={sentinelRefSales}   // ✅ FIXED: Pass sales logs sentinel
            dateFilter={dateFilter}
          />
        )}
      </div>
    </div>
  );
};

export default RecordPanel;