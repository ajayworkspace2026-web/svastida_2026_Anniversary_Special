"use client";

import { useState } from "react";
import type { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type CheckoutFormProps = {
  items: CartItem[];
  total: number;
  onSuccess: (result: { orderNumber: string; whatsappUrl: string | null }) => void;
};

export default function CheckoutForm({ items, total, onSuccess }: CheckoutFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsappPhone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    customerNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items }),
      });

      const result = (await response.json()) as {
        orderNumber?: string;
        whatsappUrl?: string | null;
        error?: string;
      };

      if (!response.ok || !result.orderNumber) {
        throw new Error(result.error ?? "We could not create your order.");
      }

      onSuccess({
        orderNumber: result.orderNumber,
        whatsappUrl: result.whatsappUrl ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const fields: Array<[keyof typeof form, string, boolean, string]> = [
    ["name", "Full name", true, "text"],
    ["phone", "Phone number", true, "tel"],
    ["whatsappPhone", "WhatsApp number", true, "tel"],
    ["email", "Email (optional)", false, "email"],
    ["addressLine1", "Address line", true, "text"],
    ["addressLine2", "Apartment / landmark (optional)", false, "text"],
    ["city", "City", true, "text"],
    ["state", "State", true, "text"],
    ["pincode", "Pincode", true, "text"],
  ];

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, required, type]) => (
          <label key={key} className={`text-sm ${key === "addressLine1" || key === "addressLine2" || key === "email" ? "sm:col-span-2" : ""}`}>
            {label}
            <input
              required={required}
              type={type}
              autoComplete={
                key === "email" ? "email" :
                key === "phone" || key === "whatsappPhone" ? "tel" :
                key === "name" ? "name" :
                "street-address"
              }
              value={form[key]}
              onChange={(event) => update(key, event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>
        ))}
      </div>

      <label className="block text-sm">
        Additional instructions (optional)
        <textarea
          rows={4}
          value={form.customerNotes}
          onChange={(event) => update("customerNotes", event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none transition focus:border-black"
        />
      </label>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">Order total</p>
          <p className="mt-1 text-2xl display-font">{formatCurrency(total)}</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating order..." : "Place order"}
        </button>
      </div>
    </form>
  );
}
