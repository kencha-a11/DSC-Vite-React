import React, { useEffect } from "react";

export default function CategoryConfirmationModal({
  categoryName,
  products = [],
  onCancel,
  onConfirm,
  isLoading = false,
  status = null, // "store" | "delete"
}) {
  const isDelete = status === "delete";
  const actionText = isDelete ? "Delete" : "Confirm";
  const loadingText = isDelete ? "Deleting..." : "Creating...";
  const actionColor = isDelete
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  const headerText = isDelete
    ? "Confirm Deletion"
    : "Category Confirmation";

  const messageText = isDelete
    ? products.length > 1
      ? "The following products will be deleted permanently:"
      : "This product will be deleted permanently:"
    : products.length > 1
    ? "The following products will be added to this category:"
    : "This product will be added to this category:";

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-lg shadow-lg z-10 w-11/12 max-w-md mx-auto p-6 transform transition-all animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 id="modal-title" className="text-xl font-semibold mb-1">
            {headerText}
          </h2>
          <p id="modal-desc" className="text-gray-700 font-medium break-words">
            {categoryName}
          </p>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center mb-4">{messageText}</p>

        {/* Products List */}
        <div className="max-h-64 overflow-y-auto mb-6 space-y-2">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50"
              >
                <img
                  src={
                    product.image ||
                    `https://via.placeholder.com/48?text=${encodeURIComponent(
                      product.name?.[0] || "?"
                    )}`
                  }
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/48?text=${encodeURIComponent(
                      product.name?.[0] || "?"
                    )}`;
                  }}
                />
                <span className="text-gray-800 truncate flex-1">{product.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">No products found</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : actionColor
            }`}
          >
            {isLoading ? loadingText : actionText}
          </button>
        </div>
      </div>

      {/* Tailwind Fade-in Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
