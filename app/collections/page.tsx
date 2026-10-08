import Link from "next/link";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import SectionHeading from "@/components/SectionHeading";
import { getCollections } from "@/lib/storefront";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <StorefrontNav />
      <main>
        <section className="border-b border-black/10 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The edit"
              title="Find your next favourite."
              description="Collections are published and ordered from the admin panel."
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          {!collections.length ? (
            <div className="border border-dashed border-black/15 p-12 text-center">
              <p className="display-font text-4xl">Collections are coming together.</p>
              <p className="mt-2 text-sm text-black/45">Once the admin publishes a collection, it will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group relative min-h-96 overflow-hidden bg-black"
                >
                  {collection.image_url ? (
                    <img src={collection.image_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-85" />
                  ) : null}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative flex min-h-96 flex-col justify-end p-7 text-white">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold-bright)]">Collection</p>
                    <h2 className="mt-2 text-5xl capitalize leading-none">{collection.name}</h2>
                    {collection.description ? <p className="mt-3 max-w-sm text-sm text-white/65">{collection.description}</p> : null}
                  </div>
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
