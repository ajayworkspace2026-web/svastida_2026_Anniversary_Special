import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function PolicyPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Store policy</p>
        <h1 className="mt-4 text-6xl leading-[0.85]">Privacy.</h1>
        <p className="mt-8 text-sm leading-7 text-black/60">Customer details are used to process enquiries, orders, customer support and website operations. Never publish customer order information or uploaded fabric images publicly.</p>
      </main>
      <StorefrontFooter />
    </>
  );
}
