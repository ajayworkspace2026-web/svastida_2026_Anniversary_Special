import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const known = ["new-arrivals", "custom-fit", "occasion"];
  if (!known.includes(slug)) notFound();

  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Collection</p>
        <h1 className="mt-4 text-7xl capitalize leading-[0.85]">{slug.replaceAll("-", " ")}</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
          Published products from this collection will render dynamically here.
        </p>
        <div className="mt-12 grid gap-6">
          <div className="border border-dashed border-black/15 p-12 text-center">
            <p className="display-font text-3xl">No published products yet.</p>
            <Link href="/admin/login" className="mt-5 inline-block text-sm underline decoration-[var(--gold)] underline-offset-8">
              Admin access
            </Link>
          </div>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
