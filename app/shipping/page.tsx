import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function PolicyPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Store policy</p>
        <h1 className="mt-4 text-6xl leading-[0.85]">Shipping.</h1>
        <p className="mt-8 text-sm leading-7 text-black/60">Shipping timelines, delivery coverage and final shipping charges will be confirmed by the team before an order is accepted.</p>
      </main>
      <StorefrontFooter />
    </>
  );
}
