import Link from "next/link";

export default function WhatsAppCta() {
  return (
    <section className="px-5 py-20 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#f4f0e6] p-8 md:flex-row md:items-center md:p-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Need help?</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Talk to a person, not a chatbot.</h2>
          <p className="mt-3 max-w-xl text-sm text-black/55">
            Ask about sizing, fabric suitability, custom fit, or an existing order.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
