import React from "react";
import { formatPeso } from "../../utils/utils";

const ConfirmModal = ({ cartItems, onConfirm, onClose }) => {
  const total = cartItems.reduce(
    (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Purchase</h3>
        <div className="max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-2 border-b pb-1"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{formatPeso(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 font-semibold">
          <span>Total</span>
          <span>{formatPeso(total)}</span>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
