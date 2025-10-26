import { useState, useMemo } from "react";
import { RemoveIcon } from "../icons";
import { useRemoveProducts } from "../../hooks/useRemoveProduct";
import CategoryConfirmationModal from "../inventory/CategoryConfirmModal";

export default function RemoveMultipleProductsModal({ products, onClose, setMessage }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate, isLoading } = useRemoveProducts();

  // 🔍 Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // ✅ Toggle product
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // ✅ Reset
  const handleReset = () => setSelectedProducts([]);

  // ✅ Confirm
  const handleConfirmRemove = () => {
    setShowConfirmation(false);
    mutate(
      { products: selectedProducts },
      {
        onSuccess: () => {
          setMessage("Products removed successfully.");
          onClose();
        },
        onError: (err) => {
          console.error(err);
          setMessage(err?.response?.data?.message || "Failed to remove selected products.");
        },
      }
    );
  };

  // ✅ Open confirmation
  const handleRemoveClick = () => {
    if (selectedProducts.length === 0) {
      setMessage("Please select at least one product to remove.");
      return;
    }
    setShowConfirmation(true);
  };

  const removeButtonText = isLoading
    ? "Removing..."
    : selectedProducts.length === 0
    ? "Select Products"
    : "Remove Selected";

  // ✅ Products to show in confirmation modal
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
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found</p>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedProducts.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`flex justify-between items-center border rounded px-3 py-2 cursor-pointer transition-colors ${
                        isSelected ? "bg-pink-50 border-pink-400" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {isSelected && <RemoveIcon className="w-4 h-4 text-pink-600" />}
                    </div>
                  );
                })
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
              <h3 className="font-semibold mb-2">Selected Products</h3>

              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products selected</p>
              ) : (
                <div className="space-y-2">
                  {productsToDelete.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center border rounded px-2 py-1"
                    >
                      <span className="truncate">{p.name}</span>
                      <button onClick={() => toggleProduct(p.id)}>
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
                disabled={selectedProducts.length === 0 || isLoading}
                className={`px-4 py-2 rounded text-white transition ${
                  selectedProducts.length === 0 || isLoading
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
          categoryName={`Products to be deleted`}
          products={productsToDelete}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRemove}
          isLoading={isLoading}
          isDelete
          status="delete"
        />
      )}
    </>
  );
}
