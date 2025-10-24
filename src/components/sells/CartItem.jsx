import { useState, useEffect } from "react";
import { formatPeso } from "../../utils/utils";
import { normalizeCategory } from "../../utils/utils";

export default function CartItem({ item, product, stock, onUpdateQuantity, onLimit }) {
  const name = product?.name ?? "Unavailable";
  const price = Number(product?.price ?? 0);
  const img =
    product?.image ||
    `https://via.placeholder.com/64?text=${encodeURIComponent((name || "P").charAt(0))}`;
  const subtotal = price * item.quantity;

  const [inputQty, setInputQty] = useState(item.quantity);

  // Keep input synced with external changes
  useEffect(() => {
    setInputQty(item.quantity);
  }, [item.quantity]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, ""); // only numbers
    setInputQty(val === "" ? "" : Math.min(Number(val), stock));
  };

  const handleBlur = () => {
    const qty = Number(inputQty || 0);
    if (qty === 0) onUpdateQuantity(item.id, 0);
    else onUpdateQuantity(item.id, qty);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-3 bg-white">
      {/* Item Details */}
      <div className="flex items-start gap-3">
        {/* Image */}
        <div className="w-16 h-16 border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src={img}
            alt={name}
            className="object-cover w-full h-full rounded"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1">
          <div className="text-sm font-semibold text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{normalizeCategory(product)}</div>
          <div className="text-xs text-gray-500">Stocks: {stock}</div>
          <div className="text-xs text-gray-600">Unit Price: {formatPeso(price)}</div>
          <div className="text-xs text-gray-600 font-medium">
            Subtotal: {formatPeso(subtotal)}
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      {/* Quantity Controls */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">Quantity:</span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (item.quantity > 1) onUpdateQuantity(item.id, item.quantity - 1);
              else onUpdateQuantity(item.id, 0);
            }}
            type="button"
            className="w-6 h-6 border border-gray-300 rounded text-sm flex items-center justify-center hover:bg-gray-100 transition"
          >
            −
          </button>

          <input
            type="text"
            value={inputQty}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-8 text-center border border-gray-300 rounded text-xs py-0.5"
          />

          <button
            onClick={() => {
              if (item.quantity < stock) onUpdateQuantity(item.id, item.quantity + 1);
              else onLimit();
            }}
            type="button"
            className={`w-6 h-6 border border-gray-300 rounded text-sm flex items-center justify-center transition ${item.quantity >= stock
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
              }`}
          >
            +
          </button>
        </div>
      </div>

    </div>
  );
}
