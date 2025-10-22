import React from "react";
import { normalizeCategory, formatPeso } from "../../utils/utils";

const ProductRow = ({ product, onAdd }) => {
  const stock = product?.stock_quantity ?? product?.stock ?? 0;

  const handleClick = () => {
    if (stock > 0) onAdd(product.id);
  };

  const img =
    product?.image ||
    `https://via.placeholder.com/64?text=${encodeURIComponent(
      (product.name || "P").charAt(0)
    )}`;

  const lowStockThreshold = product?.low_stock_threshold ?? 5;

  return (
    <div
      className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 ${
        stock <= 0 ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <img src={img} alt={product.name} className="w-16 h-16 object-cover rounded" />
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{normalizeCategory(product)}</p>
          <p
            className={`text-xs ${
              stock <= lowStockThreshold ? "text-red-500" : "text-gray-400"
            }`}
          >
            {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
          </p>
        </div>
      </div>
      <span className="font-semibold">{formatPeso(product.price)}</span>
    </div>
  );
};

export default ProductRow;
