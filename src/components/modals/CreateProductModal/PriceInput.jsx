import React from "react";

export default function PriceInput({ value, onChange }) {
  return (
    <div className="px-6">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Price</label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-500">₱</div>

        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min="1"
          className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}