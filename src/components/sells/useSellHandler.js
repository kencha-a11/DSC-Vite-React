import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSellProductsData } from "../../services/productServices";
import { createTransaction } from "../../services/saleServices";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function useSellHandler() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [showLeaveCartDialog, setShowLeaveCartDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const loaderRef = useRef();
  const debouncedSearch = useDebounce(searchInput, 400);

  // --- Fetch products from backend ---
  const fetchProducts = useCallback(
    async (pageToFetch = 1) => {
      setIsLoading(true);
      try {
        const res = await getSellProductsData(pageToFetch, 10, debouncedSearch, selectedCategory);
        const { data, hasMore } = res;
        setProducts((prev) => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(hasMore);
      } catch {
        setMessage({ type: "error", text: "Failed to load products" });
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, selectedCategory]
  );

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, selectedCategory]);

  // --- Build category list dynamically from products ---
  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      if (Array.isArray(product.categories) && product.categories.length > 0) {
        product.categories.forEach((cat) => {
          if (cat?.name) categorySet.add(cat.name);
        });
      } else {
        categorySet.add("Uncategorized");
      }
    });

    const uniqueCategories = Array.from(categorySet).map((name, idx) => ({
      id: idx + 1,
      category_name: name,
    }));

    // Always include "All" at the beginning
    return [{ id: 0, category_name: "All" }, ...uniqueCategories];
  }, [products]);

  // --- Infinite scroll ---
  useInfiniteScroll(
    loaderRef,
    () => {
      if (hasMore && !isLoading) setPage((prev) => prev + 1);
    },
    hasMore,
    isLoading
  );

  // --- Cart helpers ---
  const productsMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(p.id, p.stock_quantity ?? 0));
    return map;
  }, [products]);

  const getStockFor = useCallback((id) => productsMap.get(id) ?? 0, [productsMap]);

  const handleAddToCart = useCallback(
    (product) => {
      setCartItems((prev) => {
        const existing = prev.find((it) => it.id === product.id);
        const stock = getStockFor(product.id);
        if (existing) {
          if (existing.quantity + 1 > stock) {
            setMessage({ type: "info", text: "Stock limit reached" });
            return prev;
          }
          return prev.map((it) =>
            it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
          );
        }
        if (stock === 0) {
          setMessage({ type: "info", text: "Item out of stock" });
          return prev;
        }
        return [...prev, { id: product.id, quantity: 1, product }];
      });
    },
    [getStockFor]
  );

  const updateCartItem = useCallback(
    (id, quantity) => {
      const stock = getStockFor(id);
      if (quantity > stock) {
        quantity = stock;
        setMessage({ type: "info", text: "Stock limit reached" });
      }
      setCartItems((prev) =>
        quantity <= 0
          ? prev.filter((it) => it.id !== id)
          : prev.map((it) => (it.id === id ? { ...it, quantity } : it))
      );
    },
    [getStockFor]
  );

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, it) => sum + Number(it.product?.price ?? 0) * it.quantity,
        0
      ),
    [cartItems]
  );

  // --- Transaction handling ---
  const handleCompletePurchase = useCallback(() => {
    if (!cartItems.length)
      return setMessage({ type: "info", text: "Cart is empty" });
    setShowConfirm(true);
  }, [cartItems]);

  const confirmTransaction = useCallback(async () => {
    const snapshot = [...cartItems];
    if (!snapshot.length) {
      setMessage({ type: "info", text: "Cart is empty" });
      setShowConfirm(false);
      return;
    }

    setShowConfirm(false);
    setIsProcessing(true);

    const totalAmount = snapshot.reduce(
      (sum, it) => sum + Number(it.product.price ?? 0) * it.quantity,
      0
    );
    const payload = {
      items: snapshot.map((it) => ({
        product_id: it.id,
        quantity: it.quantity,
        snapshot_name: it.product.name,
        snapshot_price: it.product.price,
      })),
      total_amount: totalAmount,
    };

    try {
      const res = await createTransaction(payload);
      if (res?.sale_id || res?.sale) {
        setProducts((prev) =>
          prev.map((p) => {
            const purchased = snapshot.find((it) => it.id === p.id);
            return purchased
              ? {
                  ...p,
                  stock_quantity: Math.max(
                    (p.stock_quantity ?? 0) - purchased.quantity,
                    0
                  ),
                }
              : p;
          })
        );
        setCartItems([]);
        setMessage({
          type: "success",
          text: res?.message || "Transaction successful!",
        });
        setPage(1);
        setHasMore(true);
      } else {
        setMessage({ type: "error", text: res?.message || "Transaction failed" });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Transaction failed. Try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems]);

  // --- Warn before leaving with items in cart ---
  useEffect(() => {
    const handler = (e) => {
      if (cartItems.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [cartItems]);

  return {
    products,
    cartItems,
    categories,
    selectedCategory,
    searchInput,
    loaderRef,
    message,
    showConfirm,
    showClearCartConfirm,
    showLeaveCartDialog,
    isProcessing,
    total,
    isLoading,
    setSearchInput,
    setSelectedCategory,
    handleAddToCart,
    updateCartItem,
    handleCompletePurchase,
    confirmTransaction,
    setCartItems,
    setShowConfirm,
    setShowClearCartConfirm,
    setShowLeaveCartDialog,
    setMessage,
    navigate,
    pendingNavigation,
    setPendingNavigation,
    getStockFor,
  };
}
