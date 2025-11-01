import React, { useState, useEffect } from "react";
import useClickOutside from "../../../hooks/useClickOutSide";

export default function CategoryConfirmModal({
  categoryName,
  products = [],
  onClose,
  onConfirm,
  isLoading = false,
  modalRef,
}) {
  const [isVisible, setIsVisible] = useState(true);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { 
      document.body.style.overflow = "auto"; 
    };
  }, []);

  // Close when clicking outside
  useClickOutside(modalRef, () => {
    if (!isLoading) {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 200);
    }
  });

  const handleClose = () => {
    if (!isLoading) {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 200);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  const messageText = products.length > 1
    ? "The following products will be added to this category:"
    : products.length === 1
    ? "This product will be added to this category:"
    : "No products will be added to this category.";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative bg-white border-2 border-pink-800 rounded-lg shadow-lg z-10 w-full max-w-md mx-4 transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 id="confirm-modal-title" className="text-xl font-semibold text-gray-900">
            Confirm Category
          </h2>
          <p className="text-gray-700 font-medium mt-2">{categoryName}</p>
          <p className="text-sm text-gray-600 mt-2">{messageText}</p>
        </div>

        {/* Product List */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-2">
          {products.length > 0 ? (
            products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2 border-2 rounded-lg border-pink-800 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800 truncate flex-1">{p.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm py-4">
              No products selected
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-3 p-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}