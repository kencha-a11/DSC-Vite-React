export default function CartSummary({ cartItems, onAdd, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-white border rounded-lg shadow-sm flex flex-col h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      <div className="flex-1 overflow-y-auto divide-y">
        {cartItems.length === 0 ? (
          <div className="text-sm text-gray-500 py-8 text-center">Cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × P {item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <button
                  onClick={() => onAdd(item.product.id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 border-t pt-4">
        <p className="text-lg font-semibold">Total: P {total.toFixed(2)}</p>
        <button
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
}
