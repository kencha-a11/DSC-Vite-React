import React from "react";
import { useRemoveMultipleCategoriesForm } from "./useRemoveMultipleCategoriesForm";
import DualPanelModal from "../../common/DualPanelModal";
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
  } = useRemoveMultipleCategoriesForm({ onClose, onSuccess, setMessage });

  // --- Top Panel ---
  const topPanel = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Remove Categories</h2>
    </div>
  );

  // --- Left Panel ---
  const leftPanel = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

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
                <div
                  key={category.id}
                  onClick={() => handleToggleCategory(category)}
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-pink-50 border-purple-500 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {category.category_name}
                    </span>
                  </div>
                  {category.products_count !== undefined && (
                    <span className="text-xs text-gray-500 ml-2 shrink-0">
                      {category.products_count} products
                    </span>
                  )}
                </div>
              );
            })}
            {isFetchingNextPage && (
              <div className="text-center py-2 text-sm text-gray-500">Loading more...</div>
            )}
          </div>
        )}
      </div>

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
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Selected Categories ({selectedCategories.length})
        </h3>
      </div>

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
                onClick={() => handleToggleCategory(category)}
                className="flex items-center justify-between border-2 border-purple-500 rounded-lg p-4 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <span className="truncate text-sm font-medium text-gray-900">
                  {category.category_name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategory(category);
                  }}
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

      <div className="flex justify-end p-4 border-t border-gray-200">
        <button
          onClick={handleRemoveClick}
          disabled={isRemoveDisabled}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isRemoveDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-700"
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
          title="Confirm Deletion"
          message="The following categories will be deleted permanently"
          items={selectedCategories.map((c) => c.category_name)}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmRemove}
          onClose={() => setShowConfirmation(false)} // updated
          isLoading={isLoading}
        />
      )}
    </>
  );
}
