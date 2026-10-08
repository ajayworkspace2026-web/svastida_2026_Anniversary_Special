import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";

export default function ContactPage() {
  return (
    <>
      <StorefrontNav />
      <main className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Contact</p>
        <h1 className="mt-4 max-w-4xl text-7xl leading-[0.85]">A real person is one message away.</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
          The production contact CTA will use the WhatsApp number managed from the admin settings.
        </p>
        <div className="mt-10 border border-black/10 bg-[#f7f5f0] p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">WhatsApp</p>
          <p className="mt-2 text-2xl display-font">Configured from the admin panel.</p>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
