import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import StorefrontNav from "@/components/StorefrontNav";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import CollectionCard from "@/components/CollectionCard";
import AboutPreview from "@/components/AboutPreview";
import WhatsAppCta from "@/components/WhatsAppCta";
import StorefrontFooter from "@/components/StorefrontFooter";
import { getCollections, getFeaturedProducts } from "@/lib/storefront";

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getFeaturedProducts(8),
  ]);

  return (
    <>
      <StorefrontNav />
      <HeroSection />

      <main>
        <section id="collections" className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Curated edits"
              title="Collections with room for your personality."
              description="Explore the latest edits, then move into custom fit or your own-fabric design when a standard size is not enough."
            />
            {collections.length ? (
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {collections.slice(0, 3).map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    name={collection.name}
                    slug={collection.slug}
                    description={collection.description}
                    imageUrl={collection.image_url}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-12 border border-dashed border-black/15 p-12 text-center">
                <p className="display-font text-3xl">Collections are waiting for their first upload.</p>
                <p className="mt-2 text-sm text-black/45">Add collections from the admin panel and they will appear here automatically.</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Featured"
                title="Pieces worth a closer look."
              />
              <Link href="/collections" className="text-sm font-semibold underline decoration-[var(--gold)] underline-offset-8">
                View all collections
              </Link>
            </div>

            {products.length ? (
              <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-12 border border-dashed border-black/15 p-12 text-center">
                <p className="display-font text-3xl">Your first collection is almost here.</p>
                <p className="mt-2 text-sm text-black/45">
                  Products added from the admin panel will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#f7f5f0] px-5 py-24 md:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
                AI fashion designer
              </p>
              <h2 className="mt-4 text-6xl leading-[0.88]">
                Bring your fabric.
                <br />
                We&apos;ll explore the possibilities.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-black/55">
                Upload a clear photo of your fabric, choose a dress direction, and generate
                several visual concepts before speaking with the brand.
              </p>
              <Link
                href="/customise"
                className="mt-8 inline-flex rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Start designing
              </Link>
            </div>
            <div className="aspect-square border border-black/10 bg-white p-5">
              <div className="flex h-full items-center justify-center border border-[var(--gold)]/30 bg-[linear-gradient(135deg,#111_0%,#222_45%,#c3a24b_46%,#f6f1e3_65%,#fff_100%)] p-8 text-center">
                <div className="max-w-xs text-white">
                  <p className="text-xs uppercase tracking-[0.3em]">Your fabric</p>
                  <p className="mt-3 display-font text-4xl">Your next silhouette.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AboutPreview />
        <WhatsAppCta />
      </main>

      <StorefrontFooter />
    </>
  );
}
