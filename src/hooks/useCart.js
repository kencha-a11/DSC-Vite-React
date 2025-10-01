import { useState, useCallback } from "react";

export function useCart(getStockFor) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((productId) => {
    const stock = getStockFor(productId);
    if (stock <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === productId);
      if (existing) {
        if (existing.quantity >= stock) return prev;
        return prev.map((it) => it.id === productId ? { ...it, quantity: it.quantity + 1 } : it);
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  }, [getStockFor]);

  const increment = useCallback((id) => {
    setCartItems((prev) =>
      prev.map((it) => it.id === id && it.quantity < getStockFor(id) ? { ...it, quantity: it.quantity + 1 } : it)
    );
  }, [getStockFor]);

  const decrement = useCallback((id) => {
    setCartItems((prev) => prev
      .map((it) => it.id === id ? { ...it, quantity: it.quantity - 1 } : it)
      .filter(it => it.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const total = useCallback((productsById) => 
    cartItems.reduce((sum, it) => sum + (productsById[it.id]?.price ?? 0) * it.quantity, 0),
  [cartItems]);

  return { cartItems, addToCart, increment, decrement, clearCart, total };
}
