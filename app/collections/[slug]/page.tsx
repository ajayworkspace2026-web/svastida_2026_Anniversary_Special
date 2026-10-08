import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { getCollectionProducts, getCollections } from "@/lib/storefront";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const pageNumber = Math.max(1, Number(query.page ?? "1") || 1);
  const sort = query.sort ?? "";
  const q = query.q ?? "";

  const [collections, result] = await Promise.all([
    getCollections(),
    getCollectionProducts(slug, { page: pageNumber, q, sort }),
  ]);

  const collection = collections.find((item) => item.slug === slug);
  if (!collection) notFound();

  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-10 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Collection"
            title={collection.name}
            description={collection.description ?? undefined}
          />
          <Link href="/collections" className="text-sm font-medium underline decoration-[var(--gold)] underline-offset-8">
            All collections
          </Link>
        </div>

        <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_220px_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search this collection"
            className="rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <button type="submit" className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">
            Apply
          </button>
        </form>

        {!result.items.length ? (
          <div className="py-24 text-center">
            <p className="display-font text-4xl">No matching pieces found.</p>
            <Link href={`/collections/${slug}`} className="mt-5 inline-block text-sm underline decoration-[var(--gold)] underline-offset-8">
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {result.items.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <Pagination
              basePath={`/collections/${slug}`}
              page={result.page}
              hasNext={result.hasNext}
            />
          </>
        )}
      </main>
      <StorefrontFooter />
    </>
  );
}
