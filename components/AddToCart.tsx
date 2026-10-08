"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/lib/types";

type AddToCartProps = {
  item: CartItem;
  disabled?: boolean;
};

export default function AddToCart({ item, disabled }: AddToCartProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(item);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
