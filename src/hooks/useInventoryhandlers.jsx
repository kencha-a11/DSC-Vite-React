import { useState, useRef, useMemo } from "react";
import { useProductsData } from "./useProductsData";
import { useCategories } from "./useCategories";
import useDebounce from "./useDebounce";
import useInfiniteScroll from "./useInfiniteScroll";
import useClickOutside from "./useClickOutSide";

export function useInventoryHandlers() {
  // Filters and state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dropdowns and modals
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showRemoveCategory, setShowRemoveCategory] = useState(false);
  const [showRemoveProducts, setShowRemoveProducts] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState(null);

  // Refs for dropdowns/modals
  const dropdownRef = useRef(null);
  const createCategoryRef = useRef(null);
  const createProductRef = useRef(null);
  const removeCategoryRef = useRef(null);
  const removeProductsRef = useRef(null);
  const loaderRef = useRef(null);

  // Click outside for modals/dropdowns
  useClickOutside(createCategoryRef, () => {
    if (showCreateCategory) setShowCreateCategory(false);
  });
  useClickOutside(createProductRef, () => {
    if (showCreateProduct) setShowCreateProduct(false);
  });
  useClickOutside(removeCategoryRef, () => {
    if (showRemoveCategory) setShowRemoveCategory(false);
  });
  useClickOutside(removeProductsRef, () => {
    if (showRemoveProducts) setShowRemoveProducts(false);
  });

  // Categories
  const { data: categoriesData = [], refetch: refetchCategories } = useCategories();
  const categories = useMemo(() => {
    const hasAll = categoriesData.some(c => c.category_name?.toLowerCase() === "all");
    const hasUncategorized = categoriesData.some(c => c.category_name?.toLowerCase() === "uncategorized");
    let result = categoriesData;
    if (!hasAll) result = [{ id: 0, category_name: "All" }, ...result];
    if (!hasUncategorized) result = [...result, { id: -1, category_name: "Uncategorized" }];
    return result;
  }, [categoriesData]);

  // Products API
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useProductsData({
    search: debouncedSearch,
    category: selectedCategory !== "All" ? selectedCategory : "",
    status: statusFilter,
    perPage: 10,
  });

  const filteredPages = data?.pages ?? [];

  // Infinite scroll
  useInfiniteScroll(loaderRef, fetchNextPage, hasNextPage, isFetchingNextPage);

  // Status calculation
  const getStatus = (p) => {
    const stock = p.stock_quantity ?? 0;
    const threshold = p.low_stock_threshold ?? 10;
    return stock === 0 ? "out of stock" : stock <= threshold ? "low stock" : "stock";
  };

  // Universal setter
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
      set,
    },
    handlers: { getStatus, isFetchingNextPage, setEditProduct },
    filteredPages,
    categories: categories ?? [],
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

