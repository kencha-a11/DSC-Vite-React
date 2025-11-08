import { useState } from "react";

// RemoveProduct.jsx
export function RemoveProduct({ product, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSuccess();
    } catch (error) {
      console.error("Failed to remove product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-[320px] bg-white border-2 border-purple-500 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-gray-900 p-4 border-b-2 border-gray-200">Remove</h2>

        <p className="text-gray-800 p-6">
          Do you really want to delete <strong>{product?.name}</strong> from the list?
        </p>

        <div className="flex justify-between border-t-2 p-6 border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-purple-500 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Removing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}