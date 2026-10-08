import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function CartPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Cart</p>
        <h1 className="mt-4 text-7xl leading-[0.85]">Your selections.</h1>
        <div className="mt-12 border border-dashed border-black/15 p-12 text-center">
          <p className="display-font text-3xl">Your cart is empty.</p>
          <p className="mt-2 text-sm text-black/45">Add a piece from the collection to start an order.</p>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
