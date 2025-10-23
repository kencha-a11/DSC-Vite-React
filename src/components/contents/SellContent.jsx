import React, { useState, useCallback, useMemo } from "react";
import { useProductsData } from "../../hooks/useProductsData";
import { createSale } from "../../api/sales";
import { formatPeso } from "../../utils/utils";
import ProductRow from "../sells/ProductRow";
import CartItem from "../sells/CartItem";
import MessageToast from "../sells/MessageToast";
import ConfirmModal from "../sells/ConfirmModal";
import { useFilteredProducts } from "../../hooks/useFilterProduct";
import ProductFilter from "../sells/ProductFilter";

export default function SellsContent() {
  const { data: products = [], isLoading, isError, refetch } = useProductsData();
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    searchInput,
    setSearchInput,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProducts,
  } = useFilteredProducts(products);

  const productsById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const stockById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, Number(p.stock_quantity ?? p.stock ?? 0)])),
    [products]
  );
  const getStockFor = useCallback((id) => stockById[id] ?? 0, [stockById]);

  const updateCartItem = useCallback(
    (id, quantity) => {
      setCartItems((prev) => {
        const stock = getStockFor(id);
        if (quantity <= 0) return prev.filter((it) => it.id !== id);
        const qty = Math.min(quantity, stock);
        return prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it));
      });
    },
    [getStockFor]
  );

  const handleAddToCartFromList = useCallback(
    (productId) => {
      const product = productsById[productId];
      if (!product) return setMessage({ type: "error", text: "Product not available" });

      const stock = getStockFor(productId);
      if (stock <= 0) return setMessage({ type: "error", text: "Out of stock" });

      setCartItems((prev) => {
        const existing = prev.find((it) => it.id === productId);
        if (existing) {
          if (existing.quantity >= stock) {
            setMessage({ type: "info", text: "Stock limit reached" });
            return prev;
          }
          return prev.map((it) => (it.id === productId ? { ...it, quantity: it.quantity + 1, product } : it));
        }
        return [...prev, { id: productId, quantity: 1, product }];
      });
    },
    [productsById, getStockFor]
  );

  const total = useMemo(
    () => cartItems.reduce((sum, it) => sum + (Number(productsById[it.id]?.price ?? 0) * it.quantity), 0),
    [cartItems, productsById]
  );

  const handleCompletePurchase = useCallback(() => {
    if (!cartItems.length) {
      setMessage({ type: "info", text: "Cart is empty" });
      return;
    }
    setShowConfirm(true);
  }, [cartItems]);

  const confirmPurchase = useCallback(async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    try {
      // 1️⃣ Complete sale in backend
      await createSale({ items: cartItems.map((it) => ({ product_id: it.id, quantity: it.quantity })), total_amount: total });

      // 2️⃣ Clear cart and show success message
      setCartItems([]);
      setMessage({ type: "success", text: "Purchase completed" });

      // 3️⃣ Refetch products to update stock in frontend
      if (refetch) await refetch();
    } catch (err) {
      console.error("Purchase failed:", err);
      setMessage({ type: "error", text: "Failed to complete purchase" });
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems, total, refetch]);

  if (isLoading) return <div className="p-6 text-center">Loading products...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Failed to load products.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[86vh]">
      {/* Products List */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
        />
        <div className="flex-1 overflow-y-auto divide-y">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">No products found</div>
          ) : (
            filteredProducts.map((p) => <ProductRow key={p.id} product={p} onAdd={handleAddToCartFromList} />)
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-center text-lg font-semibold">Transaction Summary</h3>
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
                  onUpdateQuantity={updateCartItem}
                  onLimit={() => setMessage({ type: "info", text: "Stock limit reached" })}
                />
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-semibold">{formatPeso(total)}</span>
          </div>
          <button
            onClick={handleCompletePurchase}
            disabled={cartItems.length === 0 || isProcessing}
            className={`w-full py-2 rounded text-white text-sm font-medium ${
              cartItems.length === 0 || isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {cartItems.length === 0 ? "Empty Cart" : isProcessing ? "Processing..." : "Complete Purchase"}
          </button>
        </div>
      </div>

      {/* Toast + Modal */}
      <MessageToast message={message} onClose={() => setMessage(null)} duration={1500} />
      {showConfirm && (
        <ConfirmModal cartItems={cartItems} onClose={() => setShowConfirm(false)} onConfirm={confirmPurchase} />
      )}
    </div>
  );
}
