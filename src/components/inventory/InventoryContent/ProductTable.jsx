import { useState, useRef, useEffect } from "react";
import { SettingsIcon } from "../../icons";

export default function ProductTable({
  productsPages = [],
  getStatus,
  onEditProduct,
  onRestockProduct,
  onDeductProduct,
  onRemoveProduct,
  loaderRef,
  isFetchingNextPage = false,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const products = productsPages.flatMap((page) => page.data || []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        No products available.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-gray-200 text-sm text-gray-700">
      {products.map((p) => {
        const categories = Array.isArray(p.categories) && p.categories.length
          ? p.categories.map((c) => c?.name).filter(Boolean)
          : ["Uncategorized"];

        const visibleCats = categories.slice(0, 2);
        const extraCats = categories.length - visibleCats.length;

        return (
          <div
            key={p.id}
            className="relative grid grid-cols-[80px_2fr_120px_1fr_1.5fr_1fr_80px] items-center px-8 py-2 gap-6 hover:bg-gray-50 transition"
          >
            {/* 🖼 Image */}
            <div>
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="w-16 h-16 object-cover rounded"
              />
            </div>

            {/* 🏷 Product Name */}
            <div className="font-medium truncate">{p.name}</div>

            {/* 💰 Price */}
            <div className="overflow-hidden">
              <span className="truncate block"> {/* <-- Truncation applied to inner span */}
                ₱{Number(p.price ?? 0).toFixed(2)}
              </span>
            </div>

            {/* 📦 Quantity */}
            <div className="text-left overflow-hidden">
              <span className="truncate block"> {/* <-- Truncation applied to inner span */}
                {p.stock_quantity ?? 0}
              </span>
            </div>

            {/* 🗂 Categories */}
            <div className="flex flex-wrap gap-1 text-xs">
              {visibleCats.map((cat, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded-full border ${cat === "Uncategorized"
                    ? "border-gray-300 text-gray-500"
                    : "border-blue-300 bg-blue-50 text-blue-600"
                    }`}
                >
                  {cat}
                </span>
              ))}
              {extraCats > 0 && (
                <span className="text-gray-400">+{extraCats} more</span>
              )}
            </div>

            {/* 🧭 Status */}
            <div
              className={`capitalize font-medium ml-4 ${getStatus(p) === "out of stock"
                ? "text-red-500"
                : getStatus(p) === "low stock"
                  ? "text-yellow-500"
                  : "text-green-600"
                }`}
            >
              {getStatus(p)}
            </div>

            {/* ⚙️ Actions */}
            <div className="text-right relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setOpenDropdownId(openDropdownId === p.id ? null : p.id)
                }
                className="p-2 rounded hover:bg-gray-100 transition"
              >
                <SettingsIcon />
              </button>

              {/* Dropdown Menu - FIXED POSITIONING */}
              {openDropdownId === p.id && (
                <div
                  // KEY CHANGES: 
                  // 1. Used 'absolute' and 'top-0' to align vertically with the button.
                  // 2. Used 'right-full' to move the entire dropdown width to the left of the button.
                  // 3. Added 'mr-2' for a small gap between the icon and the dropdown.
                  className="absolute top-0 right-6 mr-2 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={() => onEditProduct(p)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRestockProduct(p)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => onDeductProduct(p)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Deduct
                  </button>
                  <button
                    onClick={() => onRemoveProduct(p)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 👇 Infinite scroll trigger */}
      <div ref={loaderRef} className="h-8 flex justify-center items-center">
        {isFetchingNextPage && (
          <div className="text-gray-500 text-sm animate-pulse">
            Loading more products...
          </div>
        )}
      </div>
    </div>
  );
}
