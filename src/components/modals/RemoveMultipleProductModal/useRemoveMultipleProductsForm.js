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
  const products = useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);

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
    { products: selectedProducts }, // object with key 'products'
    {
      onSuccess: () => {
        // Close confirmation modal
        setShowConfirmation(false);

        // Reset selection and search
        setSelectedProducts([]);
        setSearch("");

        // Show toast via onSuccess
        if (onSuccess) onSuccess();

        // Close main Remove Multiple Products modal
        if (onClose) onClose();
      },
      onError: (err) => {
        console.error("Remove products error:", err);
        const errorText = err?.response?.data?.message || "Failed to remove products";

        if (setMessage) setMessage({ type: "error", text: `❌ ${errorText}` });

        // Close confirmation modal only
        setShowConfirmation(false);
      },
    }
  );
};



  // --- Button state ---
  const removeButtonText = isRemoving
    ? "Removing..."
    : selectedProducts.length > 0
    ? `Remove Selected`
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
