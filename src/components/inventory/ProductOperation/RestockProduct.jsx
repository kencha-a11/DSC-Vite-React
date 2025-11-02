import { useState } from "react";

// RestockProduct.jsx
export function RestockProduct({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSuccess(quantity);
    } catch (error) {
      console.error("Failed to restock product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[320px] rounded-2xl border-2 border-pink-800 shadow-lg text-center">
        <h2 className="text-xl text-left font-bold p-4 border-b-2 border-gray-200">Restock</h2>

        <div className="p-6">
          <label className="block text-left text-sm font-semibold text-gray-800 mb-1">
            Restock quantity
          </label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-10 h-10 text-xl text-gray-700 border-r border-gray-300 hover:bg-gray-100 transition"
              disabled={loading}
            >
              –
            </button>
            <span className="flex-1 text-center text-gray-900 font-medium select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-10 h-10 text-xl text-gray-700 border-l border-gray-300 hover:bg-gray-100 transition"
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-between p-6 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-600 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-5 py-2 rounded-md font-medium hover:bg-purple-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}