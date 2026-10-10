"use client";

import { useState } from "react";
import Link from "next/link";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import EnquiryForm from "@/components/EnquiryForm";
import { cartItemKey } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { items, total, updateQuantity, remove, clear } = useCart();
  const [order, setOrder] = useState<{ orderNumber: string; whatsappUrl: string | null } | null>(null);

  if (order) {
    return (
      <>
        <StorefrontNav />
        <main className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Enquiry received</p>
          <h1 className="mt-5 text-7xl leading-[0.85]">Your enquiry is in.</h1>
          <p className="mt-6 text-sm leading-7 text-black/55">
            Enquiry ID: <strong className="text-black">{order.orderNumber}</strong>
          </p>
          <p className="mt-2 text-sm leading-7 text-black/55">
            We’ll share your enquiry with the Svastida team so they can contact you and confirm the details.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            {order.whatsappUrl ? (
              <a
                href={order.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Send order on WhatsApp
              </a>
            ) : null}
            <a
              href="mailto:svastidaa.helpdesk@gmail.com"
              className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold transition hover:border-black"
            >
              Email Svastida
            </a>
            <Link
              href="/collections"
              className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold transition hover:border-black"
            >
              Continue shopping
            </Link>
          </div>
        </main>
        <StorefrontFooter />
      </>
    );
  }

  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Your selections</p>
            <h1 className="mt-3 text-7xl leading-[0.82]">Shopping cart.</h1>
          </div>
          {items.length ? (
            <button type="button" onClick={clear} className="text-sm text-black/45 underline underline-offset-4 hover:text-black">
              Clear cart
            </button>
          ) : null}
        </div>

        {!items.length ? (
          <div className="py-24 text-center">
            <p className="display-font text-4xl">Your cart is empty.</p>
            <Link href="/collections" className="mt-6 inline-block rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white">
              Explore collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-5">
              {items.map((item) => {
                const key = cartItemKey(item);
                return (
                  <article key={key} className="grid grid-cols-[96px_1fr_auto] gap-4 border-b border-black/10 pb-5">
                    <div className="aspect-[4/5] bg-[#f7f5f0] overflow-hidden">
                      {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <h2 className="text-2xl display-font">{item.name}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/40">
                        Size: {item.size ?? "Custom"}
                      </p>
                      <p className="mt-3 text-sm">{formatCurrency(item.unitPrice)}</p>
                      <div className="mt-4 inline-flex items-center rounded-full border border-black/15">
                        <button type="button" onClick={() => updateQuantity(key, Math.max(1, item.quantity - 1))} className="px-3 py-1.5">−</button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(key, Math.min(10, item.quantity + 1))} className="px-3 py-1.5">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(item.unitPrice * item.quantity)}</p>
                      <button type="button" onClick={() => remove(key)} className="mt-5 text-xs text-black/40 underline underline-offset-4">
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl bg-[#f7f5f0] p-7 lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[0.22em] text-black/40">Enquiry</p>
              <h2 className="mt-3 text-4xl">Send your enquiry.</h2>
              <p className="mt-3 text-sm leading-6 text-black/50">
                No payment is taken online. We save your enquiry and, when WhatsApp is configured, send the complete enquiry details to the team for confirmation.
              </p>
              <div className="my-6 border-y border-black/10 py-5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
                <p className="mt-2 text-xs text-black/40">Shipping and final confirmation are handled by the team.</p>
              </div>
              <EnquiryForm items={items} total={total} onSuccess={(result) => { clear(); setOrder(result); }} />
            </aside>
          </div>
        )}
      </main>
      <StorefrontFooter />
    </>
  );
}
