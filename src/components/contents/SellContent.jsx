import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsData, getCategoriesData } from "../../services/productServices";
import { createTransaction } from "../../services/saleServices";
import { formatPeso } from "../../utils/formatPeso";
import ProductRow from "../sells/ProductRow";
import CartItem from "../sells/CartItem";
import MessageToast from "../../components/MessageToast";
import ConfirmModal from "../sells/ConfirmModal";
import ClearCartDialogue from "../sells/ClearCartDialogue";
import LeaveCartItemDialog from "../sells/LeaveCartItemDialog";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

// ---------- Component ----------
export default function SellsContent() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, category_name: "All" }]);
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

  // --- Load categories ---
  useEffect(() => {
    getCategoriesData()
      .then((cats) => setCategories([{ id: 0, category_name: "All" }, ...cats]))
      .catch(() => setMessage({ type: "error", text: "Failed to load categories" }));
  }, []);

  // --- Fetch products ---
  const fetchProducts = useCallback(
    async (pageToFetch = 1) => {
      setIsLoading(true);
      try {
        const res = await getProductsData(pageToFetch, 10, debouncedSearch, selectedCategory);
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

  useEffect(() => { fetchProducts(page); }, [page, fetchProducts]);
  useEffect(() => { setProducts([]); setPage(1); setHasMore(true); }, [debouncedSearch, selectedCategory]);

  useInfiniteScroll(loaderRef, () => { if (hasMore && !isLoading) setPage(prev => prev + 1); }, hasMore, isLoading);

  // --- Cart helpers ---
  const productsMap = useMemo(() => {
    const map = new Map();
    products.forEach(p => map.set(p.id, p.stock_quantity ?? 0));
    return map;
  }, [products]);
  
  const getStockFor = useCallback((id) => productsMap.get(id) ?? 0, [productsMap]);

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(it => it.id === product.id);
      const stock = getStockFor(product.id);
      if (existing) {
        if (existing.quantity + 1 > stock) { 
          setMessage({ type: "info", text: "Stock limit reached" }); 
          return prev; 
        }
        return prev.map(it => it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it);
      }
      if (stock === 0) { 
        setMessage({ type: "info", text: "Item out of stock" }); 
        return prev; 
      }
      return [...prev, { id: product.id, quantity: 1, product }];
    });
  }, [getStockFor]);

  const updateCartItem = useCallback((id, quantity) => {
    const stock = getStockFor(id);
    if (quantity > stock) { 
      quantity = stock; 
      setMessage({ type: "info", text: "Stock limit reached" }); 
    }
    setCartItems(prev => quantity <= 0 ? prev.filter(it => it.id !== id) : prev.map(it => it.id === id ? { ...it, quantity } : it));
  }, [getStockFor]);

  const total = useMemo(() => cartItems.reduce((sum, it) => sum + Number(it.product?.price ?? 0) * it.quantity, 0), [cartItems]);

  // --- Transaction ---
  const handleCompletePurchase = useCallback(() => {
    if (!cartItems.length) return setMessage({ type: "info", text: "Cart is empty" });
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

    const totalAmount = snapshot.reduce((sum, it) => sum + Number(it.product.price ?? 0) * it.quantity, 0);
    const payload = {
      items: snapshot.map(it => ({ 
        product_id: it.id, 
        quantity: it.quantity, 
        snapshot_name: it.product.name, 
        snapshot_price: it.product.price 
      })),
      total_amount: totalAmount
    };

    try {
      console.log("📤 Sending transaction:", payload);
      const res = await createTransaction(payload);
      console.log("✅ Response:", res);

      // ✅ Check for sale_id OR sale (API returns sale_id)
      if (res?.sale_id || res?.sale) {
        // 1. Update stock
        setProducts(prev => prev.map(p => {
          const purchased = snapshot.find(it => it.id === p.id);
          return purchased ? { ...p, stock_quantity: Math.max((p.stock_quantity ?? 0) - purchased.quantity, 0) } : p;
        }));
        
        // 2. Clear cart immediately
        setCartItems([]);
        
        // 3. Show success message
        setMessage({ type: "success", text: res?.message || "Transaction successful!" });
        
        // 4. Reset pagination
        setPage(1); 
        setHasMore(true);
      } else {
        setMessage({ type: "error", text: res?.message || "Transaction failed" });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Transaction failed. Try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems]);

  useEffect(() => {
    const handler = e => { 
      if (cartItems.length > 0) { 
        e.preventDefault(); 
        e.returnValue = ""; 
      } 
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [cartItems]);

  // --- Render ---
  return (
    <div className="flex flex-col md:flex-row h-[91vh]">
      {/* Products List */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden mt-4 mx-4">
        <div className="p-4 border-b border-gray-200 flex gap-3">
          <input
            type="text"
            placeholder="Search items"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-colors duration-200"
          >
            {categories.map(c => <option key={c.id} value={c.category_name}>{c.category_name}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {products.length === 0 && !isLoading
            ? <div className="text-center text-gray-500 text-sm py-8">No products found</div>
            : <div className="space-y-3">
                {products.map(p => <ProductRow key={p.id} product={p} onAdd={handleAddToCart} disabled={getStockFor(p.id) === 0} />)}
              </div>
          }
          {isLoading && <div className="text-center text-gray-400 py-3">Loading more...</div>}
          <div ref={loaderRef} className="h-20"></div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="w-full md:w-1/3 bg-white border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Transaction summary</h3>
          {cartItems.length > 0 && (
            <button 
              onClick={() => setShowClearCartConfirm(true)}
              className="text-xs font-medium hover:text-gray-700 transition border-2 border-gray-200 p-1 px-2 rounded-md bg-gray-100"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0
            ? <div className="text-center text-sm text-gray-500 py-8">No items selected</div>
            : <div className="space-y-4">
                {cartItems.map(it =>
                  <CartItem 
                    key={it.id} 
                    item={it} 
                    product={it.product} 
                    stock={getStockFor(it.id)} 
                    onUpdateQuantity={updateCartItem} 
                    onLimit={() => setMessage({ type: "info", text: "Stock limit reached" })} 
                  />
                )}
              </div>
          }
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm font-semibold">{formatPeso(total)}</span>
          </div>
          <button
            onClick={handleCompletePurchase}
            disabled={cartItems.length === 0 || isProcessing}
            className={`w-full py-2 rounded-md text-white text-sm font-medium transition-colors ${
              cartItems.length === 0 || isProcessing ? "bg-gray-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {cartItems.length === 0 ? "Empty Cart" : isProcessing ? "Processing..." : "Confirm purchase"}
          </button>
        </div>
      </div>

      {/* Toast & Modals */}
      <MessageToast message={message} onClose={() => setMessage(null)} duration={1500} />
      
      {/* Modal & Dialogue */}
      {showConfirm && (
        <ConfirmModal 
          cartItems={cartItems} 
          onClose={() => setShowConfirm(false)} 
          onConfirm={confirmTransaction} 
        />
      )}
      
      {showClearCartConfirm && (
        <ClearCartDialogue
          message="Clear Cart?"
          subMessage="Are you sure you want to remove all items from your cart? This action cannot be undone."
          onConfirm={() => { 
            setCartItems([]); 
            setShowClearCartConfirm(false); 
            setMessage({ type: "info", text: "Cart cleared" }); 
          }}
          onCancel={() => setShowClearCartConfirm(false)}
        />
      )}
      
      {showLeaveCartDialog && (
        <LeaveCartItemDialog
          message="Leave this Page?"
          subMessage="You have an ongoing transaction. Leaving now will discard all unsaved items."
          onConfirm={() => { 
            setCartItems([]); 
            setShowLeaveCartDialog(false); 
            if (pendingNavigation) { 
              navigate(pendingNavigation); 
              setPendingNavigation(null); 
            }
          }}
          onCancel={() => setShowLeaveCartDialog(false)}
        />
      )}
    </div>

  );
}