import React, { useState, useMemo, useRef } from "react";
import { createCategory } from "../../../services/categoryServices";
import { useProductsData } from "../../../hooks/useProductsData";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import DualPanelModal from "../../common/DualPanelModal";
import CategoryConfirmModal from "../../common/CategoryConfirmModal";
import CategoryNameInput from "./CategoryNameInput";
import ProductSearchPanel from "./ProductSearchPanel";
import SelectedProductsList from "./SelectedProductsList";

export default function CreateCategoryModal({ categories = [], onClose, onSuccess, setMessage }) {
  // --- Form state ---
  const [categoryName, setCategoryName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);
  const confirmModalRef = useRef(null);

  // --- Fetch products ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductsData({
    search,
    category: categoryFilter || "",
    perPage: 10,
  });

  const products = data?.pages?.flatMap((page) => page.data) ?? [];
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // --- Existing categories ---
  const existingCategories = useMemo(() => {
    const allNames = [
      ...categories.map((c) => c.category_name?.trim()).filter(Boolean),
      ...products.flatMap((p) =>
        Array.isArray(p.categories)
          ? p.categories.map((c) => c?.category_name?.trim()).filter(Boolean)
          : []
      ),
    ];

    const unique = Array.from(new Set(allNames.map((n) => n.toLowerCase()))).map(
      (n) => n.charAt(0).toUpperCase() + n.slice(1)
    );

    return ["Uncategorized", ...unique];
  }, [categories, products]);

  // --- Filtered products ---
  const availableProducts = useMemo(() => {
    return (products ?? []).filter(
      (p) => !selectedProducts.some((sp) => sp.id === p.id)
    );
  }, [products, selectedProducts]);

  // --- Handlers ---
  const handleAddProduct = (product) => setSelectedProducts((prev) => [...prev, product]);
  const handleRemoveProduct = (id) => setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  const handleReset = () => setSelectedProducts([]);

  const handleCancel = () => {
    setCategoryName("");
    setSearch("");
    setCategoryFilter("");
    setSelectedProducts([]);
    if (onClose) onClose();
  };

  const trimmedName = categoryName.trim();
  const isDuplicate = existingCategories.some(
    (c) => c.toLowerCase() === trimmedName.toLowerCase()
  );

  const handleCreateClick = () => {
    if (!trimmedName) {
      setMessage({ type: "warning", text: "⚠️ Please enter a category name" });
      return;
    }
    if (isDuplicate) {
      setMessage({ type: "warning", text: `⚠️ Category "${trimmedName}" already exists` });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmCreate = async () => {
    setIsLoading(true);
    try {
      const payload = {
        category_name: trimmedName,
        products: selectedProducts.map((p) => p.id),
      };

      await createCategory(payload);
      setShowConfirmation(false);

      // Reset form
      setCategoryName("");
      setSelectedProducts([]);
      setSearch("");
      setCategoryFilter("");

      if (onSuccess) await onSuccess();
    } catch (err) {
      const res = err?.response?.data;
      const errorText = res?.errors
        ? Object.values(res.errors).flat().join(" • ")
        : res?.message || "Failed to create category";

      setMessage({ type: "error", text: `❌ ${errorText}` });
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createButtonText = isDuplicate ? "Category exists" : isLoading ? "Creating..." : "Create";

  return (
    <>
      <DualPanelModal
        isOpen
        onClose={handleCancel}
        topPanel={
          <CategoryNameInput
            value={categoryName}
            onChange={setCategoryName}
            isDuplicate={isDuplicate}
          />
        }
        leftPanel={
          <ProductSearchPanel
            search={search}
            categoryFilter={categoryFilter}
            availableProducts={availableProducts}
            existingCategories={existingCategories}
            isFetchingNextPage={isFetchingNextPage}
            loaderRef={loaderRef}
            onSearchChange={setSearch}
            onCategoryFilterChange={setCategoryFilter}
            onProductAdd={handleAddProduct}
            onReset={handleReset}
            onCancel={handleCancel}
          />
        }
        rightPanel={
          <SelectedProductsList
            products={selectedProducts}
            onRemove={handleRemoveProduct}
            onCreateClick={handleCreateClick}
            isCreateDisabled={isDuplicate || !trimmedName || isLoading}
            createButtonText={createButtonText}
          />
        }
      />

      {showConfirmation && (
        <CategoryConfirmModal
          title="Category confirmation summary"
          confirmLabel="Create"
          categoryName={categoryName}
          products={selectedProducts}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmCreate}
          isLoading={isLoading}
          modalRef={confirmModalRef}
        />
      )}
    </>
  );
}