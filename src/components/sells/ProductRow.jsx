import React from "react";
import { normalizeCategory, formatPeso } from "../../utils/utils";

const ProductRow = ({ product, onAdd, style }) => {
  const stock = product?.stock_quantity ?? product?.stock ?? 0;
  const lowStockThreshold = product?.low_stock_threshold ?? 5;

  const handleClick = () => {
    if (stock > 0) onAdd(product.id);
  };

  const img =
    product?.images_path?.length > 0
      ? product.images_path.find(img => img.is_primary)?.image_path || product.images_path[0].image_path
      : product?.image || null;

  return (
    <div
      style={style}
      className={`flex items-start justify-between p-4 border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out min-h-[192px] ${
        stock <= 0 ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {/* Image container */}
        <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded border border-gray-200 flex items-center justify-center bg-gray-100">
          {img ? (
            <img
              src={img}
              alt={product.name || "Product image"}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none"; // hide broken image
              }}
            />
          ) : (
            <span className="text-gray-500 text-sm">No Image</span>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-start">
          <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{normalizeCategory(product) || "No Category"}</p>
          <p className={`text-xs ${stock <= lowStockThreshold ? "text-red-500" : "text-gray-400"}`}>
            {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
          </p>
        </div>
      </div>

      <span className="font-semibold text-gray-700 text-lg">{formatPeso(product.price)}</span>
    </div>
  );
};

export default React.memo(ProductRow);
