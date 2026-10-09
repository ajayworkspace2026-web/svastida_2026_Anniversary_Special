"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";
import {
  addCartItem,
  cartSnapshot,
  cartTotal,
  clearCart,
  removeCartItem,
  subscribeCart,
  updateCartQuantity,
} from "@/lib/cart";

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
  const snapshot = useSyncExternalStore(subscribeCart, cartSnapshot, () => "");

  const items = useMemo<CartItem[]>(() => {
    if (!snapshot) return [];
    try {
      const parsed = JSON.parse(snapshot) as unknown;
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  }, [snapshot]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total: cartTotal(items),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add: (item) => addCartItem(item),
      updateQuantity: (key, quantity) => updateCartQuantity(key, quantity),
      remove: (key) => removeCartItem(key),
      clear: () => clearCart(),
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
