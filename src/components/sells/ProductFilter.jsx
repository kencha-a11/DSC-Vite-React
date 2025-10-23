// src/components/sells/ProductFilter.jsx
import React from "react";

export default function ProductFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  searchInput,
  onSearchChange,
}) {
  return (
    <div className="p-6 border-b border-gray-200 flex gap-3">
      <input
        type="text"
        placeholder="Search product..."
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-40 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
