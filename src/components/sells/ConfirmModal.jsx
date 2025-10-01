const normalizeCategory = (p) =>
  p?.category?.category_name ?? p?.category?.name ?? p?.category ?? "Uncategorized";

export default function ConfirmModal({ cartItems, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-160 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Purchase</h2>

        <div className="max-h-64 overflow-y-auto divide-y mb-4">
          {cartItems.map((item) => {
            const product = item.product; 
            return (
              <div key={item.id} className="py-2 flex flex-col">
                {/* Top row: Product name × quantity and line total */}
                <div className="flex justify-between">
                  <span className="font-medium">
                    {product?.name ?? "Unavailable"} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-700">
                    P {(Number(product?.price ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Below: Category name */}
                <div className="text-xs text-gray-500">
                  {normalizeCategory(product)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
