import React from "react";
import useSellHandler from "./useSellHandler";
import { formatPeso } from "../../utils/formatPeso";
import ProductRow from "./ProductRow";
import CartItem from "./CartItem";
import MessageToast from "../MessageToast";
import ConfirmModal from "./ConfirmModal";
import ClearCartDialogue from "./ClearCartDialogue";
import LeaveCartItemDialog from "./LeaveCartItemDialog";

export default function SellsContent() {
  const {
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
  } = useSellHandler();

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
        {products
          .slice() // create a copy to avoid mutating original array
          .sort((a, b) => b.stock_quantity - a.stock_quantity) // stock first, then low/out
          .map(p => (
            <ProductRow
              key={p.id}
              product={p}
              onAdd={handleAddToCart}
              disabled={getStockFor(p.id) === 0}
            />
          ))
        }
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