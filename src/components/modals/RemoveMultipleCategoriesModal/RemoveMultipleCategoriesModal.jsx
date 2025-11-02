import React from "react";
import { useRemoveMultipleCategoriesForm } from "./useRemoveMultipleCategoriesForm";
import DualPanelModal from "../../common/DualPanelModal"; // ✅ Default import
import CategoryConfirmModal from "../../common/CategoryConfirmModal";

export default function RemoveMultipleCategoriesModal({ onClose, onSuccess, setMessage }) {
  const {
    formState: {
      selectedCategories,
      search,
      showConfirmation,
      removeButtonText,
      isRemoveDisabled,
    },
    handlers: {
      setSearch,
      handleToggleCategory,
      handleReset,
      handleCancel,
      handleRemoveClick,
      handleConfirmRemove,
      setShowConfirmation,
    },
    categoriesData: { availableCategories, isFetchingNextPage },
    isLoading,
    confirmModalRef,
  } = useRemoveMultipleCategoriesForm({ onClose, onSuccess, setMessage });

  // --- Top Panel ---
  const topPanel = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Remove Categories</h2>
      <p className="text-sm text-gray-500 mt-1">Select categories to remove from the system</p>
    </div>
  );

  // --- Left Panel ---
  const leftPanel = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto p-4">
        {availableCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No categories found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.some((c) => c.id === category.id);
              return (
                <label
                  key={category.id}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-pink-50 border-pink-600 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCategory(category)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="truncate text-sm font-medium text-gray-900">
                      {category.category_name}
                    </span>
                  </div>
                  {category.products_count !== undefined && (
                    <span className="text-xs text-gray-500 ml-2 shrink-0">
                      {category.products_count} products
                    </span>
                  )}
                </label>
              );
            })}
            {isFetchingNextPage && (
              <div className="text-center py-2 text-sm text-gray-500">Loading more...</div>
            )}
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-gray-200 flex justify-between gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          disabled={selectedCategories.length === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategories.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Reset
        </button>
      </div>
    </div>
  );

  // --- Right Panel ---
  const rightPanel = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Selected Categories ({selectedCategories.length})
        </h3>
      </div>

      {/* Selected List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No categories selected</p>
            <p className="text-xs mt-1">Select categories from the left</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between border-2 border-pink-800 rounded-lg px-3 py-2 hover:bg-pink-50 transition-colors"
              >
                <span className="truncate text-sm font-medium text-gray-900">
                  {category.category_name}
                </span>
                <button
                  onClick={() => handleToggleCategory(category)}
                  className="text-red-600 hover:text-red-700 text-xl font-bold leading-none ml-2"
                  title="Remove from selection"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleRemoveClick}
          disabled={isRemoveDisabled}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isRemoveDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {removeButtonText}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <DualPanelModal
        isOpen
        onClose={handleCancel}
        topPanel={topPanel}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
      />

      {showConfirmation && (
        <CategoryConfirmModal
          title="Confirm Category Removal"
          message={`Are you sure you want to remove ${selectedCategories.length} ${
            selectedCategories.length > 1 ? "categories" : "category"
          }? This action cannot be undone.`}
          items={selectedCategories.map((c) => c.category_name)}
          confirmLabel="Confirm Remove"
          cancelLabel="Cancel"
          onConfirm={handleConfirmRemove}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isLoading}
          modalRef={confirmModalRef}
        />
      )}
    </>
  );
}