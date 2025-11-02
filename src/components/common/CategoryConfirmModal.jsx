import React, { useState, useEffect } from "react";
import useClickOutside from "../../hooks/useClickOutSide";

export default function CategoryConfirmModal({
  title = "Confirm Action",
  message,
  items = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  categoryName,
  products = [],
  onConfirm,
  onCancel,
  isLoading = false,
  modalRef,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close modal when clicking outside (only if not loading)
  useClickOutside(modalRef, () => {
    if (!isLoading) handleClose();
  });

  const handleClose = () => {
    if (!isLoading) {
      setIsVisible(false);
      setTimeout(() => onCancel?.(), 200);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  // Build display list
  const displayList = items.length > 0 
    ? items 
    : products.map((p) => p.name || p.category_name);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* Modal Box */}
      <div
        ref={modalRef}
        onClick={stopPropagation}
        className={`relative bg-white border-2 border-red-600 rounded-lg shadow-xl z-10 w-full max-w-md mx-4 transform transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl font-bold">⚠</span>
            </div>
            <div className="flex-1">
              <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              {categoryName && (
                <p className="text-gray-700 font-medium mt-1">{categoryName}</p>
              )}
              {message && (
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-2">
          {displayList.length > 0 ? (
            displayList.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border-2 rounded-lg border-red-200 bg-red-50/50 transition-colors"
              >
                <span className="text-gray-800 truncate flex-1 text-sm font-medium">
                  {name}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm py-4">
              No items selected
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}