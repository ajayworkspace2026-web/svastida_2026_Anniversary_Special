import Link from "next/link";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import SectionHeading from "@/components/SectionHeading";
import AtelierCollectionGrid from "@/components/AtelierCollectionGrid";
import { getCollections } from "@/lib/storefront";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <StorefrontNav />
      <main>
        <section className="border-b border-black/10 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">The digital wardrobe</p>
              <h1 className="mt-5 text-7xl leading-[0.82] tracking-[-0.04em] md:text-[8rem]">
                Find your next
                <br />
                <span className="text-[#b89548]">favourite.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-black/50 md:text-base">
                Enter an immersive catalogue built around silhouette, fabric, fit, and the freedom to make each piece your own.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          {!collections.length ? (
            <div className="border border-dashed border-black/15 p-12 text-center">
              <p className="display-font text-4xl">Collections are coming together.</p>
              <p className="mt-2 text-sm text-black/45">Once the admin publishes a collection, it will appear here automatically.</p>
            </div>
          ) : (
            <AtelierCollectionGrid collections={collections} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
