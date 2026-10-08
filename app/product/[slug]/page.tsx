import { notFound } from "next/navigation";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import ProductPurchaseForm from "@/components/ProductPurchaseForm";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug, getSiteSettings } from "@/lib/storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  const effectivePrice = Number(product.sale_price ?? product.price);
  const primaryImage = product.images[0]?.publicUrl ?? null;

  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="grid gap-3 sm:grid-cols-2">
            {product.images.length ? product.images.map((image: any) => (
              <div key={image.id} className="overflow-hidden bg-[#f7f5f0]">
                {image.publicUrl ? (
                  <img
                    src={image.publicUrl}
                    alt={image.alt_text ?? product.name}
                    className="aspect-[4/5] h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
                  />
                ) : null}
              </div>
            )) : (
              <div className="aspect-[4/5] bg-[#f7f5f0]" />
            )}
          </div>

          <section className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              {product.custom_fit ? "Custom fit available" : "Ready to order"}
            </p>
            <h1 className="mt-4 text-6xl leading-[0.86]">{product.name}</h1>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-2xl">{formatCurrency(effectivePrice)}</span>
              {product.sale_price ? (
                <span className="text-sm text-black/35 line-through">
                  {formatCurrency(Number(product.price))}
                </span>
              ) : null}
            </div>

            <div className="mt-7 border-y border-black/10 py-7">
              <p className="text-sm leading-7 text-black/60">{product.description}</p>
            </div>

            <ProductPurchaseForm
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                sale_price: product.sale_price ? Number(product.sale_price) : null,
                sizes: product.sizes ?? [],
                custom_measurements_enabled: Boolean(product.custom_measurements_enabled),
                imageUrl: primaryImage,
                whatsappNumber: settings?.whatsapp_admin_number ?? null,
              }}
            />
          </section>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
