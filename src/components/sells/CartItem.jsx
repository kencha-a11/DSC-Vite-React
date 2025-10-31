import React, { useState, useEffect, useCallback } from "react";
import { normalizeCategory } from "../../utils/normalizedCategory";
import { formatPeso } from "../../utils/formatPeso";

function CartItem({ item, product, stock, onUpdateQuantity, onLimit }) {
  const name = product?.name ?? "Unavailable";
  const price = Number(product?.price ?? 0);
  const subtotal = price * item.quantity;

  // Use a more reliable placeholder
  const defaultImg = `/fallback.png`; // optional local fallback
  const placeholderImg = `https://via.placeholder.com/64x64.png?text=${encodeURIComponent(
    name.charAt(0) || "P"
  )}`;
  const img = product?.image || placeholderImg;

  const [inputQty, setInputQty] = useState(item.quantity);

  // Sync internal input state with actual quantity
  useEffect(() => {
    setInputQty(item.quantity);
  }, [item.quantity]);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value.replace(/\D/g, "");
      const newVal = val === "" ? "" : Math.min(Number(val), stock);
      setInputQty(newVal);
    },
    [stock]
  );

  const handleBlur = useCallback(() => {
    const qty = Number(inputQty || 0);
    onUpdateQuantity(item.id, qty);
  }, [inputQty, item.id, onUpdateQuantity]);

  const increment = useCallback(() => {
    if (item.quantity < stock) onUpdateQuantity(item.id, item.quantity + 1);
    else onLimit();
  }, [item.id, item.quantity, stock, onUpdateQuantity, onLimit]);

  const decrement = useCallback(() => {
    onUpdateQuantity(item.id, Math.max(item.quantity - 1, 0));
  }, [item.id, item.quantity, onUpdateQuantity]);

  return (
    <div className="border border-gray-300 rounded-lg p-3 bg-white">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src={img}
            alt={name}
            className="object-cover w-full h-full rounded"
            onError={(e) => {
              e.onerror = null;
              e.target.src = defaultImg;
            }}
          />
        </div>
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

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">Quantity:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={decrement}
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
            onClick={increment}
            type="button"
            className={`w-6 h-6 border border-gray-300 rounded text-sm flex items-center justify-center transition ${
              item.quantity >= stock ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// Only re-render if quantity, stock, or product reference changes
export default React.memo(
  CartItem,
  (prev, next) =>
    prev.item.quantity === next.item.quantity &&
    prev.stock === next.stock &&
    prev.product === next.product
);
