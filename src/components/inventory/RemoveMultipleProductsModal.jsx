import { useState, useMemo, useRef, useEffect } from "react";
import { RemoveIcon } from "../icons";
import { useRemoveProducts } from "../../hooks/useRemoveProduct";
import { useProductsData } from "../../hooks/useProductsData";
import CategoryConfirmationModal from "../inventory/CategoryConfirmModal";

export default function RemoveMultipleProductsModal({ onClose, setMessage }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate, isLoading: isRemoving } = useRemoveProducts();
  const loaderRef = useRef(null);

  // ✅ Fetch paginated products with search
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useProductsData({
    search,
    category: "All",
    perPage: 20,
  });

  // ✅ Flatten all pages into single array
  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) ?? [];
  }, [data]);

  // ✅ Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Toggle product selection
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // ✅ Reset selection
  const handleReset = () => setSelectedProducts([]);

  // ✅ Confirm removal
  const handleConfirmRemove = () => {
    setShowConfirmation(false);
    mutate(
      { products: selectedProducts },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Products removed successfully." });
          onClose();
        },
        onError: (err) => {
          console.error(err);
          setMessage({
            type: "error",
            text: err?.response?.data?.message || "Failed to remove selected products.",
          });
        },
      }
    );
  };

  // ✅ Open confirmation modal
  const handleRemoveClick = () => {
    if (selectedProducts.length === 0) {
      setMessage({ type: "error", text: "Please select at least one product to remove." });
      return;
    }
    setShowConfirmation(true);
  };

  const removeButtonText = isRemoving
    ? "Removing..."
    : selectedProducts.length === 0
    ? "Select Products"
    : "Remove Selected";

  // ✅ Get selected products for confirmation
  const productsToDelete = useMemo(
    () => products.filter((p) => selectedProducts.includes(p.id)),
    [products, selectedProducts]
  );

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-11/12 max-w-5xl h-4/5 rounded shadow-lg flex overflow-hidden animate-fadeIn">
          
          {/* Left Panel: Product List */}
          <div className="flex-1 flex flex-col border-r p-4">
            <h2 className="text-lg font-semibold mb-4">Remove Products</h2>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-pink-400"
            />

            <div className="flex-1 overflow-auto space-y-2">
              {isLoading ? (
                <p className="text-gray-500 text-center py-4">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found</p>
              ) : (
                <>
                  {products.map((p) => {
                    const isSelected = selectedProducts.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProduct(p.id)}
                        className={`flex justify-between items-center border rounded px-3 py-2 cursor-pointer transition-colors ${
                          isSelected ? "bg-pink-50 border-pink-400" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={p.image || `https://via.placeholder.com/40?text=${p.name?.[0] || "P"}`}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">₱{Number(p.price ?? 0).toFixed(2)}</div>
                          </div>
                        </div>
                        {isSelected && <RemoveIcon className="w-4 h-4 text-pink-600 shrink-0" />}
                      </div>
                    );
                  })}
                  
                  {/* Infinite scroll trigger */}
                  <div ref={loaderRef} className="h-10 flex items-center justify-center">
                    {isFetchingNextPage && (
                      <span className="text-sm text-gray-500">Loading more...</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleReset} className="px-4 py-2 border rounded hover:bg-gray-100">
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel: Selected Products */}
          <div className="flex-1 flex flex-col justify-between p-4">
            <div className="flex-1 overflow-auto">
              <h3 className="font-semibold mb-2">
                Selected Products ({selectedProducts.length})
              </h3>

              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products selected</p>
              ) : (
                <div className="space-y-2">
                  {productsToDelete.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center border rounded px-2 py-1 gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={p.image || `https://via.placeholder.com/32?text=${p.name?.[0] || "P"}`}
                          alt={p.name}
                          className="w-8 h-8 object-cover rounded shrink-0"
                        />
                        <span className="truncate text-sm">{p.name}</span>
                      </div>
                      <button 
                        onClick={() => toggleProduct(p.id)}
                        className="shrink-0"
                      >
                        <RemoveIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleRemoveClick}
                disabled={selectedProducts.length === 0 || isRemoving}
                className={`px-4 py-2 rounded text-white transition ${
                  selectedProducts.length === 0 || isRemoving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                }`}
              >
                {removeButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <CategoryConfirmationModal
          categoryName={`${productsToDelete.length} Product(s)`}
          products={productsToDelete}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRemove}
          isLoading={isRemoving}
          isDelete
          status="delete"
        />
      )}
    </>
  );
}