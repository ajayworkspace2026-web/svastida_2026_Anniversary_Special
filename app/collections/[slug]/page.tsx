import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { getCollectionProducts, getCollections } from "@/lib/storefront";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collections, products] = await Promise.all([
    getCollections(),
    getCollectionProducts(slug),
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

        {!products.length ? (
          <div className="py-24 text-center">
            <p className="display-font text-4xl">Nothing published in this collection yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </main>
      <StorefrontFooter />
    </>
  );
}
