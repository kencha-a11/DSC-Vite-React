import { useState, useMemo, useRef } from "react";
import { useProductsData } from "../../../hooks/useProductsData";
import { useRemoveProducts } from "../../../hooks/useRemoveProduct";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

export function useRemoveMultipleProductsForm({ onClose, onSuccess, setMessage }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loaderRef = useRef(null);
  const confirmModalRef = useRef(null);

  // --- Fetch products ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductsData({
    search,
    category: "All",
    perPage: 20,
  });

  // --- Flatten paginated data ---
  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) ?? [];
  }, [data]);

  // --- Infinite scroll ---
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // --- Mutation hook ---
  const { mutate, isLoading: isRemoving } = useRemoveProducts();

  // --- Selected products for display ---
  const productsToDelete = useMemo(
    () => products.filter((p) => selectedProducts.includes(p.id)),
    [products, selectedProducts]
  );

  // --- Handlers ---
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleReset = () => setSelectedProducts([]);

  const handleCancel = () => {
    setSelectedProducts([]);
    setSearch("");
    if (onClose) onClose();
  };

  const handleRemoveClick = () => {
    if (selectedProducts.length === 0) {
      if (setMessage) {
        setMessage({ type: "warning", text: "⚠️ Please select at least one product to remove" });
      }
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmRemove = () => {
    mutate(
      { products: selectedProducts },
      {
        onSuccess: () => {
          // Close confirmation modal
          setShowConfirmation(false);

          // Reset form
          setSelectedProducts([]);
          setSearch("");

          // Call success callback - parent will handle toast and refetch
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          console.error("Remove products error:", err);
          
          const errorText = err?.response?.data?.message || "Failed to remove products";
          
          if (setMessage) {
            setMessage({ type: "error", text: `❌ ${errorText}` });
          }
          
          // Close confirmation modal on error
          setShowConfirmation(false);
        },
      }
    );
  };

  // --- Button state ---
  const removeButtonText = isRemoving
    ? "Removing..."
    : selectedProducts.length > 0
    ? `Remove ${selectedProducts.length} Product${selectedProducts.length > 1 ? "s" : ""}`
    : "Remove";

  const isRemoveDisabled = isRemoving || selectedProducts.length === 0;

  return {
    formState: {
      selectedProducts,
      search,
      showConfirmation,
      removeButtonText,
      isRemoveDisabled,
      isLoading,
    },
    handlers: {
      toggleProduct,
      handleReset,
      handleCancel,
      handleRemoveClick,
      handleConfirmRemove,
      setSearch,
      setShowConfirmation,
    },
    productsData: {
      products,
      productsToDelete,
      loaderRef,
      confirmModalRef,
      isFetchingNextPage,
    },
    isRemoving,
  };
}