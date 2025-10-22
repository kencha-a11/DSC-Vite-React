import { formatPeso } from "../../utils/utils";
import { normalizeCategory } from "../../utils/utils";

export default function CartItem({ item, product, stock, onIncrement, onDecrement, onLimit }) {
  const name = product?.name ?? "Unavailable";
  const price = Number(product?.price ?? 0);
  const img =
    product?.image ||
    `https://via.placeholder.com/64?text=${encodeURIComponent((name || "P").charAt(0))}`;

  const total = price * item.quantity;

  return (
    <div className="border rounded p-3">
      {/* Top row: image + product info, and right-side prices */}
      <div className="flex justify-between">
        {/* Left side: image + name/category/stock */}
        <div className="flex items-start">
          <img src={img} alt={name} className="w-12 h-12 object-cover rounded" />
          <div className="ml-3">
            <div className="font-medium text-gray-800">{name}</div>
            <div className="text-xs text-gray-500">{normalizeCategory(product)}</div>
            <div className="text-xs text-gray-400">Stock: {stock}</div>
          </div>
        </div>

        {/* Right side: unit price above total */}
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-gray-700">Unit Price: {formatPeso(price)}</div>
          <div className="text-xs text-gray-500">Total: {formatPeso(total)}</div>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-600">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrement(item.id)}
            className="px-2 py-1 border rounded hover:bg-gray-100"
            type="button"
          >
            −
          </button>

          <span className="px-2">{item.quantity}</span>

          <button
            onClick={() => (item.quantity < stock ? onIncrement(item.id) : onLimit())}
            type="button"
            className={`px-2 py-1 border rounded ${
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
