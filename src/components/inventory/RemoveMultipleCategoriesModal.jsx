import { useState, useMemo } from "react";
import { RemoveIcon } from "../icons";
import { useRemoveCategories } from "../../hooks/useRemoveCategories";
import CategoryConfirmationModal from "../inventory/CategoryConfirmModal";

export default function RemoveMultipleCategoriesModal({ products, onClose, setMessage }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate, isLoading } = useRemoveCategories();

  // 🧩 Extract unique categories except "Uncategorized"
  const existingCategories = useMemo(() => {
    const allCats = products.flatMap((p) =>
      Array.isArray(p.categories) ? p.categories.map((c) => c.category_name) : []
    );
    return [...new Set(allCats)].filter((c) => c && c !== "Uncategorized");
  }, [products]);

  // 🔍 Filter categories by search term
  const filteredCategories = useMemo(
    () =>
      existingCategories.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [existingCategories, search]
  );

  const hasSelected = selectedCategories.length > 0;
  const hasFiltered = filteredCategories.length > 0;

  // ✅ Toggle category
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ✅ Reset handler
  const handleReset = () => setSelectedCategories([]);

  // ✅ Find products that will be detached
  const productsToDetach = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    return products.filter((p) =>
      Array.isArray(p.categories) &&
      p.categories.some((c) => selectedCategories.includes(c.category_name))
    );
  }, [products, selectedCategories]);

  // ✅ Confirm removal
  const handleConfirmRemove = () => {
    setShowConfirmation(false);
    mutate(
      { categories: selectedCategories },
      {
        onSuccess: () => {
          setMessage("Categories removed successfully.");
          onClose();
        },
        onError: (err) => {
          console.error(err);
          setMessage(err?.response?.data?.message || "Failed to remove selected categories.");
        },
      }
    );
  };

  // ✅ Trigger confirmation modal
  const handleRemoveClick = () => {
    if (!hasSelected) {
      setMessage("Please select at least one category to remove.");
      return;
    }
    setShowConfirmation(true);
  };

  const removeButtonText = isLoading
    ? "Removing..."
    : hasSelected
    ? "Remove Selected"
    : "Select Categories";

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
              {!hasFiltered ? (
                <p className="text-gray-500 text-center py-4">No categories found</p>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <div
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex justify-between items-center border rounded px-3 py-2 cursor-pointer transition-colors ${
                        isSelected ? "bg-pink-50 border-pink-400" : "hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat}</span>
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

              {!hasSelected ? (
                <p className="text-gray-500 text-center py-4">No categories selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedCategories.map((cat) => (
                    <div
                      key={cat}
                      className="flex justify-between items-center border rounded px-2 py-1"
                    >
                      <span>{cat}</span>
                      <button onClick={() => toggleCategory(cat)}>
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
                disabled={!hasSelected || isLoading}
                className={`px-4 py-2 rounded text-white transition ${
                  !hasSelected || isLoading
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
          categoryName={selectedCategories.join(", ")}
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
