import React, { useMemo } from "react";
import { formatPeso } from "../../utils/formatPeso";

const ConfirmModal = ({ cartItems = [], onConfirm, onClose, title = "Confirm Purchase" }) => {
  // Memoize total calculation
  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  if (cartItems.length === 0) return null; // nothing to confirm

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col  border-2 border-pink-400" style={{maxHeight: '90vh'}}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 text-base text-gray-700"
            >
              <span className="font-normal">
                {item.product?.name ?? "Unavailable"} <span className="mx-2">x</span> {item.quantity}
              </span>
              <span className="font-medium">{formatPeso((item.product?.price ?? 0) * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div className="px-6 py-5 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-gray-900">{formatPeso(total)}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;