// components/InventoryContent/useInventoryHandlers.js
import { useState, useRef, useMemo } from "react";
import { useProductsData } from "../../../hooks/useProductsData";
import { useCategoryData } from "../../../hooks/useCategoryData";
import useDebounce from "../../../hooks/useDebounce";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import useClickOutside from "../../../hooks/useClickOutside";

export function useInventoryHandler() {
  // =========================
  // Filters and state
  // =========================
  const [searchInput, setSearchInput] = useState("");          // Search input
  const debouncedSearch = useDebounce(searchInput, 400);       // Debounced search
  const [statusFilter, setStatusFilter] = useState("");        // Status filter: "stock", "low stock", "out of stock"
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 = All categories

  // =========================
  // Dropdowns and modals
  // =========================
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showRemoveCategory, setShowRemoveCategory] = useState(false);
  const [showRemoveProducts, setShowRemoveProducts] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState(null);

  const [restockProduct, setRestockProduct] = useState(null);
  const [deductProduct, setDeductProduct] = useState(null);
  const [removeProduct, setRemoveProduct] = useState(null);

  // =========================
  // Refs for dropdowns/modals
  // =========================
  const dropdownRef = useRef(null);
  const createCategoryRef = useRef(null);
  const createProductRef = useRef(null);
  const removeCategoryRef = useRef(null);
  const removeProductsRef = useRef(null);
  const loaderRef = useRef(null);

  // =========================
  // Click outside for modals/dropdowns
  // =========================
  useClickOutside(createCategoryRef, () => showCreateCategory && setShowCreateCategory(false));
  useClickOutside(createProductRef, () => showCreateProduct && setShowCreateProduct(false));
  useClickOutside(removeCategoryRef, () => showRemoveCategory && setShowRemoveCategory(false));
  useClickOutside(removeProductsRef, () => showRemoveProducts && setShowRemoveProducts(false));

  // =========================
  // Categories
  // =========================
  const { data: categoriesData = [], refetch: refetchCategories } = useCategoryData();

  const categories = useMemo(() => {
    const hasAll = categoriesData.some(c => c.category_name?.toLowerCase() === "all");
    const hasUncategorized = categoriesData.some(c => c.category_name?.toLowerCase() === "uncategorized");

    let result = categoriesData;

    // Always include "All" category
    if (!hasAll) result = [{ id: 0, category_name: "All" }, ...result];

    // Always include "Uncategorized" category
    if (!hasUncategorized) result = [...result, { id: -1, category_name: "Uncategorized" }];

    return result;
  }, [categoriesData]);

  // =========================
  // Normalize selectedCategory for backend
  // =========================
  const categoryValue = useMemo(() => {
    if (selectedCategory === 0) return "";          // All categories
    if (selectedCategory === -1) return "uncategorized"; // Uncategorized
    return selectedCategory;                        // Category ID
  }, [selectedCategory]);

  // =========================
  // Products API
  // =========================
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useProductsData({
    search: debouncedSearch,
    category: categoryValue,
    status: statusFilter.toLowerCase(), // 💡 ensure lowercase for backend matching
    perPage: 10,
  });

  const filteredPages = data?.pages ?? [];

  // =========================
  // Infinite scroll
  // =========================
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // =========================
  // Status calculation for frontend display
  // =========================
  const getStatus = (p) => {
    const stock = p.stock_quantity ?? 0;
    const threshold = p.low_stock_threshold ?? 10;
    // Return correct status string
    return stock === 0 ? "out of stock" : stock <= threshold ? "low stock" : "stock";
  };

  // =========================
  // Universal setter
  // =========================
  const set = (key, value) => {
    const setters = {
      searchInput: setSearchInput,
      statusFilter: setStatusFilter,
      selectedCategory: setSelectedCategory,
      dropdownOpen: setDropdownOpen,
      showCreateCategory: setShowCreateCategory,
      showCreateProduct: setShowCreateProduct,
      showRemoveCategory: setShowRemoveCategory,
      showRemoveProducts: setShowRemoveProducts,
      editProduct: setEditProduct,
      message: setMessage,
    };
    if (setters[key]) setters[key](value);
    else console.warn(`⚠️ Unknown state key: "${key}"`);
  };

  return {
    state: {
      searchInput,
      statusFilter,
      selectedCategory,
      dropdownOpen,
      showCreateCategory,
      showCreateProduct,
      showRemoveCategory,
      showRemoveProducts,
      editProduct,
      restockProduct,
      deductProduct,
      removeProduct,
    },
    setState: {
      setSearchInput,
      setStatusFilter,
      setSelectedCategory,
      setDropdownOpen,
      setShowCreateCategory,
      setShowCreateProduct,
      setShowRemoveCategory,
      setShowRemoveProducts,
      setEditProduct,
      setMessage,
      setRestockProduct,
      setDeductProduct,
      setRemoveProduct,
      set,
    },
    handlers: { getStatus, isFetchingNextPage, setEditProduct },
    filteredPages,
    categories,
    loaderRef,
    message,
    refetch,
    refetchCategories,
    refs: {
      dropdownRef,
      createCategoryRef,
      createProductRef,
      removeCategoryRef,
      removeProductsRef,
    },
  };
}
