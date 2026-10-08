import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { ProductListItem } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductListItem }) {
  const effectivePrice = product.sale_price ?? product.price;

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden bg-[#f5f3ee]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[4/5] items-end p-6 text-sm text-black/40">
            Product image coming soon
          </div>
        )}
      </Link>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${product.slug}`} className="text-lg font-medium hover:text-[var(--gold)]">
              {product.name}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/45">
              {product.custom_fit ? "Custom fit available" : "Ready to order"}
            </p>
          </div>
          <div className="text-right text-sm font-medium">
            {product.sale_price ? (
              <>
                <div className="text-[var(--gold)]">{formatCurrency(effectivePrice)}</div>
                <div className="text-xs text-black/35 line-through">{formatCurrency(product.price)}</div>
              </>
            ) : (
              formatCurrency(effectivePrice)
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
