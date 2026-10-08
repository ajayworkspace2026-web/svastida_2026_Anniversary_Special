"use client";

import { useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";
import AddToCart from "@/components/AddToCart";
import { recommendSize } from "@/utils/sizeAI";

type ProductPurchaseFormProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    sale_price: number | null;
    sizes: string[];
    custom_measurements_enabled: boolean;
    imageUrl: string | null;
  };
};

const measurementFields = [
  ["bust", "Bust (cm)"],
  ["waist", "Waist (cm)"],
  ["hips", "Hips (cm)"],
  ["shoulder", "Shoulder (cm)"],
  ["sleeveLength", "Sleeve length (cm)"],
  ["dressLength", "Dress length (cm)"],
];

export default function ProductPurchaseForm({ product }: ProductPurchaseFormProps) {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});

  const recommended = useMemo(() => {
    const bust = Number(measurements.bust);
    if (!Number.isFinite(bust) || bust <= 0) return null;
    return recommendSize(bust);
  }, [measurements.bust]);

  const cartItem: CartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    unitPrice: product.sale_price ?? product.price,
    quantity,
    size: size || null,
    measurements,
    imageUrl: product.imageUrl,
    aiDesignUrl: null,
  };

  return (
    <div className="mt-8 space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.length ? product.sizes.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setSize(value)}
              className={`min-w-12 rounded-full border px-4 py-2.5 text-sm transition ${size === value ? "border-black bg-black text-white" : "border-black/15 hover:border-black"}`}
            >
              {value}
            </button>
          )) : (
            <p className="text-sm text-black/45">Custom sizing available.</p>
          )}
        </div>
        {recommended ? (
          <p className="mt-3 text-xs text-[var(--gold)]">
            Suggested starting size from bust measurement: {recommended}
          </p>
        ) : null}
      </div>

      {product.custom_measurements_enabled ? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/45">Custom fit</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {measurementFields.map(([key, label]) => (
              <label key={key} className="text-sm">
                {label}
                <input
                  inputMode="decimal"
                  type="number"
                  min="0"
                  max="300"
                  step="0.1"
                  value={measurements[key] ?? ""}
                  onChange={(event) =>
                    setMeasurements((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none transition focus:border-black"
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-black/45">Quantity</p>
        <div className="mt-3 inline-flex items-center rounded-full border border-black/15">
          <button type="button" className="px-4 py-2 text-lg" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
          <span className="min-w-10 text-center text-sm">{quantity}</span>
          <button type="button" className="px-4 py-2 text-lg" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
        </div>
      </div>

      <AddToCart item={cartItem} disabled={product.sizes.length > 0 && !size} />
      {product.sizes.length > 0 && !size ? (
        <p className="text-xs text-black/40">Select a size to continue.</p>
      ) : null}
    </div>
  );
}
