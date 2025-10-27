import React from "react";
import { normalizeCategory } from "../../utils/normalizedCategory";
import { formatPeso } from "../../utils/formatPeso";

const ProductRow = ({ product, onAdd, style }) => {
  const stock = product?.stock_quantity ?? product?.stock ?? 0;
  const lowStockThreshold = product?.low_stock_threshold ?? 5;

  const handleClick = () => {
    if (stock > 0) onAdd(product); // pass full product instead of just ID
  };

  const img =
    product?.images_path?.length > 0
      ? product.images_path.find((img) => img.is_primary)?.image_path ||
      product.images_path[0].image_path
      : product?.image || null;

  return (
    <div
      style={style}
      onClick={handleClick}
      className={`relative flex items-start justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out ${stock <= 0 ? "opacity-50 pointer-events-none" : ""
        }`}
    >
      {/* Left section: Image + Info */}
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="shrink-0 w-34 h-34 rounded border border-gray-200 flex items-center justify-center bg-gray-100 overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between h-34 py-1">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 leading-tight">
              {product.name || "Unnamed Product"}
            </h3>
            <p className="text-base text-gray-500">
              {normalizeCategory(product) || "No Category"}
            </p>
          </div>
          <p
            className={`text-base ${stock <= lowStockThreshold ? "text-red-500" : "text-gray-500"
              }`}
          >
            Stocks : {stock}
          </p>
        </div>
      </div>

      {/* Unit Price in upper-right corner */}
      <div className="absolute top-4 right-5 text-base font-semibold text-gray-800 whitespace-nowrap">
        Unit price : {formatPeso(product.price)}
      </div>
    </div>
  );
};

export default React.memo(ProductRow);
