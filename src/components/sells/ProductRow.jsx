const normalizeCategory = (p) =>
  p?.category?.category_name ?? p?.category?.name ?? p?.category ?? "Uncategorized";

export default function ProductRow({ product, onAdd }) {
  const formatPeso = (n) => `P ${Number(n ?? 0).toFixed(2)}`;
  const stock = product?.stock_quantity ?? product?.stock ?? 0;

  const handleClick = () => {
    if (stock > 0) {
      onAdd(product.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-center p-3 rounded cursor-pointer hover:bg-gray-50 ${
        stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {/* Left side: Name, Category, Stock */}
      <div className="flex flex-col">
        <span className="font-medium">{product.name}</span>
        <span className="text-xs text-gray-500">{normalizeCategory(product)}</span>
        <span className="text-xs text-gray-400">
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </span>
      </div>

      {/* Right side: Price */}
      <span className="text-sm font-semibold text-gray-700">{formatPeso(product.price)}</span>
    </div>
  );
}
