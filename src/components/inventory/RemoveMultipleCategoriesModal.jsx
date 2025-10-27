import { useState, useMemo, useCallback, useEffect } from "react";
import { RemoveIcon } from "../icons";
import { useRemoveCategories } from "../../hooks/useRemoveCategories";
import { useCategories } from "../../hooks/useCategories";
import CategoryConfirmationModal from "../inventory/CategoryConfirmModal";

export default function RemoveMultipleCategoriesModal({ products = [], onClose, setMessage }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate, isLoading } = useRemoveCategories();

  // ✅ Fetch categories directly from API
  const { data: categoriesData = [], isLoading: loadingCategories } = useCategories();

  // 🔹 Filter out "All" category and apply search
  const filteredCategories = useMemo(() => {
    return categoriesData
      .filter((c) => c.id !== 0 && c.category_name !== "All")
      .filter((c) =>
        c.category_name.toLowerCase().includes(search.toLowerCase())
      );
  }, [categoriesData, search]);

  const hasSelected = selectedCategories.length > 0;

  // 🔹 Toggle category selection by ID
  const toggleCategory = useCallback((categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // 🔹 Reset selection
  const handleReset = useCallback(() => setSelectedCategories([]), []);

  // 🔹 Find products that will be affected
  const productsToDetach = useMemo(() => {
    if (!hasSelected) return [];
    return (Array.isArray(products) ? products : []).filter(
      (p) =>
        Array.isArray(p.categories) &&
        p.categories.some((c) => selectedCategories.includes(c.id))
    );
  }, [products, selectedCategories, hasSelected]);

  // 🔹 Confirm removal
  const handleConfirmRemove = useCallback(() => {
    setShowConfirmation(false);

    // Get category names for API
    const categoryNames = categoriesData
      .filter((c) => selectedCategories.includes(c.id))
      .map((c) => c.category_name);

    mutate(
      { categories: categoryNames },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Categories removed successfully." });
          onClose();
        },
        onError: (err) => {
          console.error(err);
          setMessage({
            type: "error",
            text: err?.response?.data?.message || "Failed to remove selected categories.",
          });
        },
      }
    );
  }, [mutate, selectedCategories, categoriesData, onClose, setMessage]);

  // 🔹 Trigger confirmation modal
  const handleRemoveClick = useCallback(() => {
    if (!hasSelected) {
      setMessage({ type: "error", text: "Please select at least one category to remove." });
      return;
    }
    setShowConfirmation(true);
  }, [hasSelected, setMessage]);

  const removeButtonText = isLoading
    ? "Removing..."
    : hasSelected
      ? "Remove Selected"
      : "Select Categories";

  // Get selected category names for display
  const selectedCategoryNames = useMemo(() => {
    return categoriesData
      .filter((c) => selectedCategories.includes(c.id))
      .map((c) => c.category_name);
  }, [categoriesData, selectedCategories]);

  return (
    <>
      {/* Modal Background */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-11/12 max-w-5xl h-4/5 rounded shadow-lg flex overflow-hidden animate-fadeIn">
          {/* Left Panel: Category List */}
          <div className="flex-1 flex flex-col border-r p-4">
            <h2 className="text-lg font-semibold mb-4">Remove Categories</h2>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-pink-400"
            />

            <div className="flex-1 overflow-auto space-y-2">
              {loadingCategories ? (
                <p className="text-gray-500 text-center py-4">Loading categories...</p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No categories found</p>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex justify-between items-center border rounded px-3 py-2 cursor-pointer transition-colors ${isSelected ? "bg-pink-50 border-pink-400" : "hover:bg-gray-50"
                        }`}
                    >
                      <span>{cat.category_name}</span>
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

          {/* Right Panel: Selected Categories */}
          <div className="flex-1 flex flex-col justify-between p-4">
            <div className="flex-1 overflow-auto">
              <h3 className="font-semibold mb-2">Selected Categories</h3>
              {hasSelected ? (
                <div className="space-y-2">
                  {categoriesData
                    .filter((c) => selectedCategories.includes(c.id))
                    .map((cat) => (
                      <div
                        key={cat.id}
                        className="flex justify-between items-center border rounded px-2 py-1"
                      >
                        <span>{cat.category_name}</span>
                        <button onClick={() => toggleCategory(cat.id)}>
                          <RemoveIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No categories selected</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleRemoveClick}
                disabled={!hasSelected || isLoading}
                className={`px-4 py-2 rounded text-white transition ${!hasSelected || isLoading
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
          categoryName={selectedCategoryNames.join(", ")}
          products={productsToDetach}
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