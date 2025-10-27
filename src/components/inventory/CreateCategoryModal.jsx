import { useState, useMemo, useRef, useEffect } from "react";
import { RemoveIcon } from "../icons";
import { createCategory } from "../../services/categoryServices";
import { useProductsData } from "../../hooks/useProductsData";
import CategoryConfirmationModal from "../inventory/CategoryConfirmModal";

export default function CreateCategoryModal({ onClose, setMessage, onSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useProductsData({
      search,
      category: categoryFilter,
      perPage: 10,
    });

  const products = data?.pages?.flatMap((page) => page.data) ?? [];

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Extract unique existing categories
  const existingCategories = useMemo(() => {
    const cats = products.flatMap((p) =>
      Array.isArray(p.categories)
        ? p.categories
            .map((c) => c?.category_name)
            .filter((name) => typeof name === "string" && name.trim() !== "")
        : []
    );
    return ["Uncategorized", ...Array.from(new Set(cats))];
  }, [products]);

  // Filtered available products
  const availableProducts = useMemo(() => {
    return products
      .filter((p) => !selectedProducts.find((sp) => sp.id === p.id))
      .filter((p) =>
        search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((p) =>
        !categoryFilter
          ? true
          : categoryFilter === "Uncategorized"
          ? !Array.isArray(p.categories) || p.categories.length === 0
          : Array.isArray(p.categories) &&
            p.categories.some((c) => c?.category_name === categoryFilter)
      );
  }, [products, selectedProducts, search, categoryFilter]);

  // Handlers
  const handleAddProduct = (product) =>
    setSelectedProducts((prev) => [...prev, product]);
  const handleRemoveProduct = (id) =>
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  const handleReset = () => setSelectedProducts([]);

  // Confirm and create
  const handleConfirmCreate = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    try {
      const payload = {
        category_name: categoryName.trim(),
        products: selectedProducts.map((p) => p.id),
      };

      console.log("➡️ Sending to backend:", payload);
      const newCategory = await createCategory(payload);
      console.log("✅ Response:", newCategory);

      // Refetch via parent handler
      if (typeof onSuccess === "function") {
        await onSuccess();
      }

      // Show toast message
      setMessage({
        type: "success",
        text: `✅ Category "${categoryName}" created successfully`,
      });

      // Reset and close
      setTimeout(() => {
        setCategoryName("");
        setSelectedProducts([]);
        setSearch("");
        setCategoryFilter("");
        onClose();
      }, 300);
    } catch (err) {
      console.error("❌ Error creating category:", err);
      const res = err?.response?.data;
      const errorText =
        res?.errors
          ? Object.values(res.errors).flat().join(" • ")
          : res?.message || "Failed to create category";

      setMessage({ type: "error", text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation
  const trimmedName = categoryName.trim();
  const isDuplicate = existingCategories.some(
    (c) => typeof c === "string" && c.toLowerCase() === trimmedName.toLowerCase()
  );

  const handleCreateClick = () => {
    if (!trimmedName) {
      setMessage({ type: "warning", text: "⚠️ Please enter a category name" });
      return;
    }
    if (isDuplicate) {
      setMessage({
        type: "warning",
        text: `⚠️ Category "${trimmedName}" already exists`,
      });
      return;
    }
    setShowConfirmation(true);
  };

  const createButtonText = isDuplicate
    ? "Category already exists"
    : isLoading
    ? "Creating..."
    : "Create";

  const isCreateDisabled = isLoading || !trimmedName || isDuplicate;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-11/12 max-w-6xl h-4/5 rounded shadow-lg flex overflow-hidden">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col border-r p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Create Category</h2>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="flex-1 mb-4 overflow-auto">
              <h3 className="font-semibold mb-2">Category Products</h3>
              <div className="space-y-2">
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border rounded px-2 py-1 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span>{p.name}</span>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.id)}>
                      <RemoveIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col p-4">
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Search product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded px-2 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">All Categories</option>
                {existingCategories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-auto space-y-2">
              {availableProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border rounded px-2 py-1 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAddProduct(p)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span>{p.name}</span>
                  </div>
                  <div>
                    {Array.isArray(p.categories) && p.categories.length > 0
                      ? p.categories
                          .map((c) => c?.category_name)
                          .filter(Boolean)
                          .join(", ")
                      : "Uncategorized"}
                  </div>
                </div>
              ))}
              <div ref={loaderRef} className="h-10" />
              {isFetchingNextPage && (
                <div className="text-center py-2 text-gray-500">
                  Loading more...
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCreateClick}
                disabled={isCreateDisabled}
                className={`px-4 py-2 rounded text-white ${
                  isCreateDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {createButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <CategoryConfirmationModal
          categoryName={categoryName}
          products={selectedProducts}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmCreate}
          isLoading={isLoading}
          status="store"
        />
      )}
    </>
  );
}
