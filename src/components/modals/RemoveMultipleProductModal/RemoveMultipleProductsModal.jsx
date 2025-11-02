import React from "react";
import { useRemoveMultipleProductsForm } from "./useRemoveMultipleProductsForm";
import DualPanelModal from "../../common/DualPanelModal";
import CategoryConfirmModal from "../../common/CategoryConfirmModal";

export default function RemoveMultipleProductsModal({ onClose, onSuccess, setMessage }) {
  const {
    formState: {
      selectedProducts,
      search,
      showConfirmation,
      removeButtonText,
      isRemoveDisabled,
      isLoading,
    },
    handlers: {
      toggleProduct,
      handleReset,
      handleCancel,
      handleRemoveClick,
      handleConfirmRemove,
      setSearch,
      setShowConfirmation,
    },
    productsData: {
      products,
      productsToDelete,
      loaderRef,
      confirmModalRef,
      isFetchingNextPage,
    },
    isRemoving,
  } = useRemoveMultipleProductsForm({ onClose, onSuccess, setMessage });

  // --- Top Panel ---
  const topPanel = (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Remove Products</h2>
      <p className="text-sm text-gray-500 mt-1">Select products to remove from inventory</p>
    </div>
  );

  // --- Left Panel ---
  const leftPanel = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No products found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-pink-50 border-pink-600 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={product.image || `https://via.placeholder.com/40?text=${product.name?.[0] || "P"}`}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded shrink-0"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/40?text=${product.name?.[0] || "P"}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">₱{Number(product.price ?? 0).toFixed(2)}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={loaderRef} className="py-4 text-center">
              {isFetchingNextPage && <span className="text-sm text-gray-500">Loading more...</span>}
            </div>
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
          disabled={selectedProducts.length === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedProducts.length === 0
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
          Selected Products ({selectedProducts.length})
        </h3>
      </div>

      {/* Selected List */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No products selected</p>
            <p className="text-xs mt-1">Click products to select them</p>
          </div>
        ) : (
          <div className="space-y-2">
            {productsToDelete.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-2 border-pink-800 rounded-lg px-3 py-2 hover:bg-pink-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img
                    src={product.image || `https://via.placeholder.com/32?text=${product.name?.[0] || "P"}`}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded shrink-0"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/32?text=${product.name?.[0] || "P"}`;
                    }}
                  />
                  <span className="truncate text-sm text-gray-900">{product.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProduct(product.id);
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
          title="Confirm Product Removal"
          message={`Are you sure you want to remove ${productsToDelete.length} ${
            productsToDelete.length > 1 ? "products" : "product"
          }? This action cannot be undone.`}
          products={productsToDelete}
          confirmLabel="Confirm Remove"
          cancelLabel="Cancel"
          onConfirm={handleConfirmRemove}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isRemoving}
          modalRef={confirmModalRef}
        />
      )}
    </>
  );
}