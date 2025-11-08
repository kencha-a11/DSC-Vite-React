import { useState } from "react";

// DeductProduct.jsx
export function DeductProduct({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSuccess(quantity, reason);
    } catch (error) {
      console.error("Failed to deduct product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-[320px] bg-white border-2 border-pink-800 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 p-4">Deduct</h2>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Deduct quantity
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

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="example: Damaged, Lost"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows="3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-between border-t-2 border-gray-200 p-6">
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
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}