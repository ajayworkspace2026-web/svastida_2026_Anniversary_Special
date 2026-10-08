"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
      className="relative rounded-full border border-black/15 px-4 py-2 text-sm transition hover:border-black hover:bg-black hover:text-white"
    >
      Cart
      {count > 0 ? (
        <span className="ml-2 inline-grid min-w-5 place-items-center rounded-full bg-[var(--gold-bright)] px-1.5 text-xs font-bold text-black">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
