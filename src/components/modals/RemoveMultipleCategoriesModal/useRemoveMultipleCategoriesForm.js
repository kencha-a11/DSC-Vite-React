import { useState, useMemo, useRef } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { useRemoveCategories } from "../../../hooks/useRemoveCategories";

export function useRemoveMultipleCategoriesForm({ onClose, onSuccess, setMessage }) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const confirmModalRef = useRef(null);

  // --- Fetch all categories ---
  const { data: categories = [], isFetching } = useCategories();

  // --- Filter out selected ones ---
  const availableCategories = useMemo(() => {
    return categories
      .filter((c) => !selectedCategories.some((s) => s.id === c.id))
      .filter((c) =>
        search ? c.category_name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((c) => {
        // Filter out special categories that shouldn't be deleted
        const name = c.category_name?.toLowerCase();
        return name !== "all" && name !== "uncategorized" && c.id !== 0 && c.id !== -1;
      });
  }, [categories, selectedCategories, search]);

  // --- Mutation hook ---
  const { mutateAsync: removeCategories, isLoading } = useRemoveCategories();

  // --- Toggle category selection ---
  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === category.id)
        ? prev.filter((c) => c.id !== category.id)
        : [...prev, category]
    );
  };

  const handleReset = () => setSelectedCategories([]);

  const handleCancel = () => {
    setSelectedCategories([]);
    setSearch("");
    if (onClose) onClose();
  };

  const handleRemoveClick = () => {
    if (selectedCategories.length === 0) {
      if (setMessage) {
        setMessage({ type: "warning", text: "⚠️ Please select at least one category" });
      }
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmRemove = async () => {
    try {
      // ✅ Send category_name strings, not IDs
      const categoryNames = selectedCategories.map((c) => c.category_name);
      
      await removeCategories(categoryNames);

      // Close confirmation modal
      setShowConfirmation(false);

      // Reset form
      setSelectedCategories([]);
      setSearch("");

      // Call success callback - parent will handle toast and refetch
      if (onSuccess) await onSuccess();

    } catch (err) {
      console.error("Remove categories error:", err);
      
      const res = err?.response?.data;
      const errorText = res?.errors
        ? Object.values(res.errors).flat().join(" • ")
        : res?.message || "Failed to remove categories";

      if (setMessage) {
        setMessage({ type: "error", text: `❌ ${errorText}` });
      }
      
      // Close confirmation modal on error
      setShowConfirmation(false);
    }
  };

  const removeButtonText = isLoading
    ? "Removing..."
    : selectedCategories.length > 0
    ? `Remove ${selectedCategories.length} ${selectedCategories.length > 1 ? "Categories" : "Category"}`
    : "Remove";

  const isRemoveDisabled = isLoading || selectedCategories.length === 0;

  return {
    formState: {
      selectedCategories,
      search,
      showConfirmation,
      removeButtonText,
      isRemoveDisabled,
    },
    handlers: {
      setSearch,
      handleToggleCategory,
      handleReset,
      handleCancel,
      handleRemoveClick,
      handleConfirmRemove,
      setShowConfirmation,
    },
    categoriesData: {
      availableCategories,
      loaderRef: useRef(null),
      isFetchingNextPage: isFetching,
    },
    isLoading,
    confirmModalRef,
  };
}