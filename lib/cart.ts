import type { CartItem } from "@/lib/types";

export const CART_STORAGE_KEY = "svastida-cart";

export function cartSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CART_STORAGE_KEY) ?? "";
}

export function readCart(): CartItem[] {
  const value = cartSnapshot();
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function subscribeCart(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const sync = () => listener();
  window.addEventListener("storage", sync);
  window.addEventListener("svastida-cart-change", sync);

  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener("svastida-cart-change", sync);
  };
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("svastida-cart-change"));
}

export function addCartItem(item: CartItem) {
  const cart = readCart();
  const existing = cart.find(
    (entry) =>
      entry.productId === item.productId &&
      entry.size === item.size &&
      JSON.stringify(entry.measurements) === JSON.stringify(item.measurements) &&
      entry.aiDesignUrl === item.aiDesignUrl,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  writeCart(cart);
  return cart;
}

export function updateCartQuantity(productKey: string, quantity: number) {
  const cart = readCart()
    .map((item) =>
      cartItemKey(item) === productKey ? { ...item, quantity } : item,
    )
    .filter((item) => item.quantity > 0);

  writeCart(cart);
  return cart;
}

export function removeCartItem(productKey: string) {
  const cart = readCart().filter((item) => cartItemKey(item) !== productKey);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

export function cartItemKey(item: CartItem) {
  return [
    item.productId,
    item.size ?? "",
    JSON.stringify(item.measurements ?? {}),
    item.aiDesignUrl ?? "",
  ].join("::");
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}
