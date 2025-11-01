import React from "react";
import ProductSearchFilters from "./ProductSearchFilter";
import AvailableProductsList from "./AvailableProductList";

export default function ProductSearchPanel({
  search,
  categoryFilter,
  availableProducts,
  existingCategories,
  isFetchingNextPage,
  loaderRef,
  onSearchChange,
  onCategoryFilterChange,
  onProductAdd,
  onCancel,
  onReset,
}) {
  return (
    <>
      <ProductSearchFilters
        search={search}
        categoryFilter={categoryFilter}
        existingCategories={existingCategories}
        onSearchChange={onSearchChange}
        onCategoryFilterChange={onCategoryFilterChange}
      />

      <AvailableProductsList
        products={availableProducts}
        isFetchingNextPage={isFetchingNextPage}
        loaderRef={loaderRef}
        onProductAdd={onProductAdd}
      />

      <div className="flex justify-end p-4 border-t border-gray-200">
        <div className="w-full flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-900 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

