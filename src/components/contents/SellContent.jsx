import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useProductsData } from "../../hooks/useProductsData";
import ProductRow from "../sells/ProductRow";
import CartItem from "../sells/CartItem";
import MessageToast from "../sells/MessageToast";
import { createSale } from "../../api/sales";
import ConfirmModal from "../sells/ConfirmModal";

const formatPeso = (n) => `P ${Number(n ?? 0).toFixed(2)}`;
const normalizeCategory = (p) =>
  p?.category?.category_name ?? p?.category?.name ?? p?.category ?? "Uncategorized";

export default function SellsContent() {
  const { data: products = [], isLoading, isError } = useProductsData();
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-clear messages
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 1500);
    return () => clearTimeout(timer);
  }, [message]);

  // Index products by ID
  const productsById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const getStockFor = useCallback(
    (id) => Number(productsById[id]?.stock_quantity ?? productsById[id]?.stock ?? 0),
    [productsById]
  );

  // Categories
  const categories = useMemo(() => {
    const cats = products.map((p) => normalizeCategory(p));
    return ["All", ...new Set(cats)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const category = normalizeCategory(p).toLowerCase();
      const matchesCategory =
        selectedCategory === "All" || normalizeCategory(p) === selectedCategory;
      const matchesSearch = !s || name.includes(s) || category.includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  // Sync cart with stock
  useEffect(() => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          const stock = getStockFor(it.id);
          return { ...it, quantity: Math.min(it.quantity, Math.max(0, stock)) };
        })
        .filter((it) => it.quantity > 0)
    );
  }, [getStockFor]);

  // --- Cart actions ---
  const handleAddToCartFromList = useCallback(
    (productId) => {
      const product = productsById[productId];
      if (!product) return setMessage("Product not available");

      const stock = getStockFor(productId);
      if (stock <= 0) return setMessage("Out of stock");

      setCartItems((prev) => {
        const existing = prev.find((it) => it.id === productId);
        if (existing) {
          if (existing.quantity >= stock) {
            setMessage("Stock limit reached");
            return prev;
          }
          return prev.map((it) =>
            it.id === productId ? { ...it, quantity: it.quantity + 1, product } : it
          );
        }
        return [...prev, { id: productId, quantity: 1, product }];
      });
    },
    [productsById, getStockFor]
  );

  const handleIncrement = useCallback(
    (id) => {
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id && it.quantity < getStockFor(id)
            ? { ...it, quantity: it.quantity + 1 }
            : it
        )
      );
    },
    [getStockFor]
  );

  const handleDecrement = useCallback((id) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it)).filter(
        (it) => it.quantity > 0
      )
    );
  }, []);

  const total = useMemo(
    () =>
      cartItems.reduce((sum, it) => {
        const price = Number(productsById[it.id]?.price ?? 0);
        return sum + price * it.quantity;
      }, 0),
    [cartItems, productsById]
  );

  const handleCompletePurchase = useCallback(() => {
    if (cartItems.length === 0) {
      setMessage("Cart is empty");
      return;
    }
    setShowConfirm(true);
  }, [cartItems]);

  const confirmPurchase = useCallback(async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    try {
      const payload = {
        items: cartItems.map((it) => ({ product_id: it.id, quantity: it.quantity })),
        total_amount: total,
      };
      await createSale(payload);
      setMessage("Purchase completed");
      setCartItems([]);
    } catch (err) {
      console.error("Purchase failed:", err);
      setMessage("Failed to complete purchase");
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems, total]);

  // --- UI ---
  if (isLoading) return <div className="p-6 text-center">Loading products...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load products.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
      {/* Products list */}
      <div className="flex-1 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Sell</h2>
        </div>

        <div className="p-4 border-b flex gap-3">
          <input
            type="text"
            placeholder="Search product..."
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-40 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto divide-y">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">No products found</div>
          ) : (
            filteredProducts.map((p) => (
              <ProductRow key={p.id} product={p} onAdd={handleAddToCartFromList} />
            ))
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full md:w-1/3 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-center text-lg font-semibold">Transaction summary</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">No items selected</div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((it) => (
                <CartItem
                  key={it.id}
                  item={it}
                  product={it.product}
                  stock={getStockFor(it.id)}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onLimit={() => setMessage("Stock limit reached")}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-semibold">{formatPeso(total)}</span>
          </div>
          <button
            onClick={handleCompletePurchase}
            disabled={cartItems.length === 0 || isProcessing}
            className={`w-full py-2 rounded text-white text-sm font-medium ${
              cartItems.length === 0 || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="button"
          >
            {cartItems.length === 0
              ? "Empty Cart"
              : isProcessing
              ? "Processing..."
              : "Complete Purchase"}
          </button>
        </div>
      </div>

      <MessageToast message={message} />

      {showConfirm && (
        <ConfirmModal
          cartItems={cartItems}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPurchase}
        />
      )}
    </div>
  );
}
