import { useState, useMemo, useRef } from "react";
import { createCategory } from "../../../services/categoryServices";
import { useProductsData } from "../../../hooks/useProductsData";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

export function useCreateCategoryForm({ onClose, setMessage, onSuccess }) {
  // --- Form state ---
  const [categoryName, setCategoryName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // track confirmation modal

  // --- Refs ---
  const loaderRef = useRef(null);

  // --- Fetch products ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsData({ search, category: categoryFilter, perPage: 10 });

  const products = data?.pages?.flatMap((page) => page.data ?? []) ?? [];

  // --- Infinite Scroll ---
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // --- Existing categories ---
  const existingCategories = useMemo(() => {
    const cats = products.flatMap((p) =>
      Array.isArray(p.categories)
        ? p.categories
            .map((c) => c?.category_name)
            .filter((n) => typeof n === "string" && n.trim() !== "")
        : []
    );
    return ["Uncategorized", ...Array.from(new Set(cats))];
  }, [products]);

  // --- Available products after filtering ---
  const availableProducts = useMemo(() => {
    return products
      .filter((p) => !selectedProducts.some((sp) => sp.id === p.id))
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

  // --- Handlers ---
  const handleAddProduct = (product) =>
    setSelectedProducts((prev) => [...prev, product]);
  const handleRemoveProduct = (id) =>
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  const handleReset = () => setSelectedProducts([]);

  const trimmedName = categoryName.trim();
  const isDuplicate = existingCategories.some(
    (c) => typeof c === "string" && c.toLowerCase() === trimmedName.toLowerCase()
  );

  // --- Open Confirmation Modal ---
  const handleCreateClick = () => {
    if (!trimmedName) {
      setMessage({ type: "warning", text: "⚠️ Please enter a category name" });
      return;
    }
    if (isDuplicate) {
      setMessage({ type: "warning", text: `⚠️ Category "${trimmedName}" already exists` });
      return;
    }
    setShowConfirmation(true); // ✅ open confirmation modal
  };

  // --- Confirm & Create Category ---
  const handleConfirmCreate = async () => {
    setIsLoading(true);
    try {
      const payload = {
        category_name: trimmedName,
        products: selectedProducts.map((p) => p.id),
      };

      console.log("Sending payload to backend:", payload);

      await createCategory(payload);

      setMessage({
        type: "success",
        text: `✅ Category "${trimmedName}" created successfully`,
      });

      // Reset form
      setCategoryName("");
      setSelectedProducts([]);
      setSearch("");
      setCategoryFilter("");
      setShowConfirmation(false);

      if (typeof onSuccess === "function") await onSuccess();
      if (typeof onClose === "function") onClose();
    } catch (err) {
      const res = err?.response?.data;
      const errorText = res?.errors
        ? Object.values(res.errors).flat().join(" • ")
        : res?.message || "Failed to create category";

      setMessage({ type: "error", text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Button state ---
  const createButtonText = isDuplicate
    ? "Category already exists"
    : isLoading
    ? "Creating..."
    : "Create";
  const isCreateDisabled = isLoading || !trimmedName || isDuplicate;

  return {
    formState: { categoryName, selectedProducts, search, categoryFilter, isDuplicate, createButtonText, isCreateDisabled, showConfirmation },
    handlers: { setCategoryName, setSearch, setCategoryFilter, handleAddProduct, handleRemoveProduct, handleReset, handleCreateClick, handleConfirmCreate, setShowConfirmation },
    productsData: { availableProducts, existingCategories, loaderRef, isFetchingNextPage },
    isLoading,
  };
}
