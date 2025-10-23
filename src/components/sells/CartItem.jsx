import { useState, useEffect } from "react";
import { formatPeso } from "../../utils/utils";
import { normalizeCategory } from "../../utils/utils";

export default function CartItem({ item, product, stock, onUpdateQuantity, onLimit }) {
  const name = product?.name ?? "Unavailable";
  const price = Number(product?.price ?? 0);
  const img =
    product?.image ||
    `https://via.placeholder.com/64?text=${encodeURIComponent((name || "P").charAt(0))}`;
  const total = price * item.quantity;

  const [inputQty, setInputQty] = useState(item.quantity);

  // Keep input in sync with cart changes
  useEffect(() => {
    setInputQty(item.quantity);
  }, [item.quantity]);

  // Handle typing
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, ""); // only numbers
    setInputQty(val === "" ? "" : Math.min(Number(val), stock));
  };

  // Update cart on blur
  const handleBlur = () => {
    const qty = Number(inputQty || 0);
    if (qty === 0) {
      onUpdateQuantity(item.id, 0); // remove from cart
    } else {
      onUpdateQuantity(item.id, qty); // set new quantity
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      <div className="flex justify-between">
        {/* Left: Image + Info */}
        <div className="flex items-start space-x-3">
          <img src={img} alt={name} className="w-14 h-14 object-cover rounded-lg" />
          <div>
            <div className="font-medium text-gray-800">{name}</div>
            <div className="text-xs text-gray-500">{normalizeCategory(product)}</div>
            <div className="text-xs text-gray-400">Stock: {stock}</div>
          </div>
        </div>

        {/* Right: Prices */}
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-gray-700">Unit Price: {formatPeso(price)}</div>
          <div className="text-xs text-gray-500">Total: {formatPeso(total)}</div>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (item.quantity > 1) onUpdateQuantity(item.id, item.quantity - 1);
              else onUpdateQuantity(item.id, 0);
            }}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            type="button"
          >
            −
          </button>

          <input
            type="text"
            value={inputQty}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1"
          />

          <button
            onClick={() => {
              if (item.quantity < stock) onUpdateQuantity(item.id, item.quantity + 1);
              else onLimit();
            }}
            type="button"
            className={`px-3 py-1 border border-gray-300 rounded-lg transition ${item.quantity >= stock ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
