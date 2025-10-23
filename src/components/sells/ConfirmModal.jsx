import React, { useMemo } from "react";
import { formatPeso } from "../../utils/utils";

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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex-1 overflow-y-auto max-h-64">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 border-b pb-1 text-sm"
            >
              <span>
                {item.product?.name ?? "Unavailable"} x {item.quantity}
              </span>
              <span>{formatPeso((item.product?.price ?? 0) * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 font-semibold text-gray-800">
          <span>Total</span>
          <span>{formatPeso(total)}</span>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
