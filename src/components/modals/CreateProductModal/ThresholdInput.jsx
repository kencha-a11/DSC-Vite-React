import React from "react";

export default function ThresholdInput({ value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        Low Stock Threshold
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}