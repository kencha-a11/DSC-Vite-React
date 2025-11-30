import { useState, useRef, useEffect } from "react";
import { SettingsIcon } from "../../icons";
import { EditProduct } from "../ProductOperation/EditProduct";

export default function ProductTable({
  productsPages = [],
  categories = [],
  getStatus,
  onRestockProduct,
  onDeductProduct,
  onRemoveProduct,
  onEditProduct, // centralized handler
  loaderRef,
  isFetchingNextPage = false,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const products = productsPages.flatMap((page) => page.data || []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest("#edit-product-modal")
      ) {
        setOpenDropdownId(null);
      }
    }

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        No products available.
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200 text-sm text-gray-700">
        {products.map((p) => {
          const categoriesList =
            Array.isArray(p.categories) && p.categories.length
              ? p.categories.map((c) => c?.name).filter(Boolean)
              : ["Uncategorized"];

          const visibleCats = categoriesList.slice(0, 2);
          const extraCats = categoriesList.length - visibleCats.length;

          return (
            <div
              key={p.id}
              className="relative grid grid-cols-[80px_2fr_120px_1fr_1.5fr_1fr_80px] items-center px-8 py-2 gap-6 hover:bg-gray-50 transition"
            >
              {/* Image or fallback first letter */}
              <div>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.style.display = "none"; // hide broken image
                      e.target.parentNode.querySelector(".fallback-letter").style.display = "flex"; // show fallback
                    }}
                  />
                ) : null}
                <div
                  className="fallback-letter w-16 h-16 hidden items-center justify-center rounded bg-gray-200 text-gray-700 font-bold text-lg"
                >
                  {p.name?.charAt(0).toUpperCase() || "?"}
                </div>
              </div>



              {/* Product Name */}
              <div className="font-medium truncate">{p.name}</div>

              {/* Price */}
              <div className="overflow-hidden">
                <span className="truncate block">
                  ₱{Number(p.price ?? 0).toFixed(2)}
                </span>
              </div>

              {/* Quantity */}
              <div className="text-left overflow-hidden">
                <span className="truncate block">{p.stock_quantity ?? 0}</span>
              </div>

              {/* Categories */}
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
                {extraCats > 0 && <span className="text-gray-400">+{extraCats} more</span>}
              </div>

              {/* Status */}
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

              {/* Actions */}
              <div className="text-right relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId((prev) => (prev === p.id ? null : p.id));
                  }}
                  className="p-2 rounded hover:bg-gray-100 transition"
                >
                  <SettingsIcon />
                </button>

                {openDropdownId === p.id && (
                  <div
                    ref={dropdownRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-6 mr-2 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-40"
                  >
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setOpenDropdownId(null);
                        onRestockProduct(p);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => {
                        setOpenDropdownId(null);
                        onDeductProduct(p);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Deduct
                    </button>
                    <button
                      onClick={() => {
                        setOpenDropdownId(null);
                        onRemoveProduct(p);
                      }}
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

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-8 flex justify-center items-center">
          {isFetchingNextPage && (
            <div className="text-gray-500 text-sm animate-pulse">
              Loading more products...
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProduct
          product={selectedProduct} // ✅ use local selectedProduct
          categories={categories}
          isOpen={isModalOpen} // ✅ modal visibility
          onClose={handleCloseModal}
          onSuccess={(formData, productId) => onEditProduct(selectedProduct, formData)}
        />
      )}
    </>
  );
}
