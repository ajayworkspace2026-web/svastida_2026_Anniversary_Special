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
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    size?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const pageNumber = Math.max(1, Number(query.page ?? "1") || 1);
  const min = query.min === undefined || query.min === "" ? undefined : Number(query.min);
  const max = query.max === undefined || query.max === "" ? undefined : Number(query.max);
  const filterOptions = {
    page: pageNumber,
    q: query.q ?? "",
    sort: query.sort ?? "",
    size: query.size ?? "",
    minPrice: Number.isFinite(min) ? min : undefined,
    maxPrice: Number.isFinite(max) ? max : undefined,
  };

  const [collections, result] = await Promise.all([
    getCollections(),
    getCollectionProducts(slug, filterOptions),
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

        <form className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.65fr_0.65fr_180px_90px]">
          <input name="q" defaultValue={query.q ?? ""} placeholder="Search this collection" className="rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          <input name="min" defaultValue={query.min ?? ""} type="number" min="0" placeholder="Min ₹" className="rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          <input name="max" defaultValue={query.max ?? ""} type="number" min="0" placeholder="Max ₹" className="rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black" />
          <select name="size" defaultValue={query.size ?? ""} className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black">
            <option value="">All sizes</option>
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          <button type="submit" className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">Apply</button>
        </form>

        <div className="mt-4 flex justify-end">
          <form method="get" action={`/collections/${slug}`}>
            <input type="hidden" name="q" value={query.q ?? ""} />
            <input type="hidden" name="min" value={query.min ?? ""} />
            <input type="hidden" name="max" value={query.max ?? ""} />
            <input type="hidden" name="size" value={query.size ?? ""} />
            <select
              name="sort"
              defaultValue={query.sort ?? ""}
              aria-label="Sort products"
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs"
              onChange={(event) => event.currentTarget.form?.submit()}
            >
            <option value="">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            </select>
          </form>
        </div>

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
              query={{
                q: query.q,
                sort: query.sort,
                size: query.size,
                min: query.min,
                max: query.max,
              }}
            />
          </>
        )}
      </main>
      <StorefrontFooter />
    </>
  );
}
