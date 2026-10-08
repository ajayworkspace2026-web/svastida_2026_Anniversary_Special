import Link from "next/link";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import SectionHeading from "@/components/SectionHeading";

const featuredCollections = [
  { slug: "new-arrivals", name: "New Arrivals", text: "Fresh pieces, newly added." },
  { slug: "custom-fit", name: "Custom Fit", text: "Personalised silhouettes and measurements." },
  { slug: "occasion", name: "Occasion Edit", text: "Pieces for evenings, celebrations and everything between." },
];

export default function CollectionsPage() {
  return (
    <>
      <StorefrontNav />
      <main>
        <section className="border-b border-black/10 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The edit"
              title="Find your next favourite."
              description="Collections are managed from the admin panel and will appear here as soon as they are published."
            />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {featuredCollections.map((collection, index) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group min-h-80 border border-black/10 bg-[#f7f5f0] p-8 transition duration-300 hover:-translate-y-1 hover:border-black"
              >
                <span className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">0{index + 1}</span>
                <h2 className="mt-20 text-5xl capitalize leading-none transition group-hover:text-[var(--gold)]">
                  {collection.name}
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-black/50">{collection.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
