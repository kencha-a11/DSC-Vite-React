import { useMemo } from "react";

export default function ProductSearchFilters({
  search,
  categoryFilter,
  existingCategories,
  onSearchChange,
  onCategoryFilterChange,
}) {
  // Filter duplicates and normalize capitalization
  const categoriesOptions = useMemo(() => {
    const normalized = Array.from(
      new Set(
        existingCategories.map((c) => (c ? c.trim() : ""))
      )
    );

    return normalized.filter((c) => c.toLowerCase() !== "all");
  }, [existingCategories]);

  return (
    <div className="mb-4 flex gap-2 p-4">
      <input
        type="text"
        placeholder="Search product"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-1/2 flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
        className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="">All Categories</option>
        <option value="Uncategorized">Uncategorized</option>
        {categoriesOptions
          .filter((c) => c.toLowerCase() !== "uncategorized")
          .map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
      </select>
    </div>
  );
}
