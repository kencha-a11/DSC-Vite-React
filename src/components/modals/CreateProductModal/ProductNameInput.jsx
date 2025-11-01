import React from "react";

export default function ProductNameInput({ value, onChange }) {
  return (
    <div className="px-6">
      <label className="text-sm font-medium text-gray-700  block">
        Product Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter product name"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}