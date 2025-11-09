import React, { useEffect, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

export default function CategoryConfirmModal({
  title = "",
  message = "",
  items = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  products = [],
  onConfirm,
  onClose, // use this consistently
  isLoading = false,
}) {
  const modalRef = useRef(null); // always internal ref

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useClickOutside(modalRef, () => {
    if (!isLoading) onClose?.();
  });

  const stopPropagation = (e) => e.stopPropagation();

  const displayList = items.length > 0 ? items : products.map((p) => p.name || p.category_name);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div
        ref={modalRef}
        onClick={stopPropagation}
        className="relative h-[58vh] bg-white border-2 border-purple-500 rounded-lg shadow-xl z-10 w-full max-w-md mx-4 flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
        </div>
        <p className="pt-4 px-4 text-red-500">{message}</p>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {displayList.length > 0 ? (
            displayList.map((name, index) => (
              <div key={index} className="border-2 border-purple-500 rounded-lg p-4 bg-white flex items-center">
                <span className="text-gray-800 text-sm truncate">{name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm py-4">No items selected</p>
          )}
        </div>

        <div className="flex justify-between gap-3 p-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => onClose?.()}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
