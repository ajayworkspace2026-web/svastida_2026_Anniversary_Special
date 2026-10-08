"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";
import { addCartItem, clearCart, readCart, removeCartItem, updateCartQuantity, cartTotal } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  add: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("svastida-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("svastida-cart-change", sync);
    };
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total: cartTotal(items),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add: (item) => setItems(addCartItem(item)),
      updateQuantity: (key, quantity) => setItems(updateCartQuantity(key, quantity)),
      remove: (key) => setItems(removeCartItem(key)),
      clear: () => {
        clearCart();
        setItems([]);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
