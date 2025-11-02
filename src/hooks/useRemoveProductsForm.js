import { useState, useMemo, useRef } from "react";
import { useRemoveProducts } from "./useRemoveProduct";
import { useProductsData } from "./useProductsData";
import useInfiniteScroll from "./useInfiniteScroll";

export function useRemoveProductsForm({ onclose, setMessage }) {
  // --- Form state ---
  const [selectedProducts, setSelectedProducts] = useState([]); // list of current selected products and ready to change
  const [search, setSearch] = useState(""); // search available product | retrieve to backend | onchange
  const [showConfirmation, setShowConfirmation] = useState(false); // confirmation modal with set to false | close state

  const loaderRef = useRef(null); // not exactly how this work
  const confirmModalRef = useRef(null); // also same to here

  //  --- API hooks ---
  const { mutate, isLoading: isRemoving } = useRemoveProducts(); // not exactly how mutate & remove works

  // --- Fetch products with pagination ---
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProductsData({
      search,
      category: "All",
      perPage: 20, // ito yung mga data hahanapin sa pag fetch
    });

  // --- Flatten paginated data ---
  const products = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) ?? [];
  }, [data]); // ito yung dependency | ano ba yung dependency? | compare: no changes no re-rendering

  // --- Infinite scroll ---
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // --- Selected products for display ---
  const productsToDelete = useMemo(
    () => products.filter((p) => selectedProducts.includes(p.id)),
    [products, selectedProducts] // useMemo will only recompute the memoized value when one of the deps has changed.
  );

  // --- Handlers ---
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleReset = () => setSelectedProducts([]); // just empty the list

  const handleCancel = () => {
    setSelectedProducts([]); // dapat walang laman to pag umalis ka
    setSearch(""); // same goes here
    if (onClose) onClose(); // single condition | close agad yung remove multiple product modal
  };

  const handleremoveClick = () => {
    if (selectedProducts.lenght === 0) {
      setMessage({
        type: "warning",
        text: "Please select at least one product to remove",
      });
      return;
    }
    setShowConfirmation(true); // activate natin yung confirm modal
  };

  const handleConfirmRemove = () => {
    mutate(
      { products: selectedProducts },
      {
        onSuccess: () => {
          setShowConfirmation(false); // itago o close yung confirmation modal
          setSelectedProducts([]); // alisin yung selected products
          setSearch(""); // alisin laman ng search input

          // Parent handles: closing modal, showing toast, refetching data after operation
          if (onClose) onclose();
          if (setMessage) {
            setMessage({
              type: "success",
              text: "Products removed successfully",
            });
          }
        },
        onError: (err) => {
          // console.error("Remove products error:", err) // ayaw koto
          const errorText =
            err?.response?.data?.message || "Failed to remove products";
          setMessage({ type: "error", text: errorText });
          setShowConfirmation(false);
        },
      }
    );
  };

  // --- Button state ---
  const removeButtonText = isRemoving
  ? "Removing..."
  : selectedProducts.length === 0
  ? "Selected Products"
  : `remove ${selectedProducts.length} Product${selectedProducts.length > 1 ? "s" : ""}`

  return{
    formState: {
        selectedProducts,
        search,
        showConfirmation,
        removeButtonText,
        isRemoving,
        isLoading,
    },
    productsData: {
        products,
        productsToDelete,
        loaderRef,
        confirmModalRef,
        isFetchingNextPage,
    }
  }
}
