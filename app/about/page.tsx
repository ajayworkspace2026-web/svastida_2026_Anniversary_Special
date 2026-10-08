import StorefrontNav from "@/components/StorefrontNav";
import StorefrontFooter from "@/components/StorefrontFooter";
import { getSiteSettings } from "@/lib/storefront";

const milestones = [
  ["01", "The beginning", "A simple idea: make the person wearing the garment part of the design process."],
  ["02", "The craft", "Combine curated fashion with practical custom-fit options and thoughtful service."],
  ["03", "The next step", "Use technology to help customers visualise possibilities before placing an order."],
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <StorefrontNav />
      <main>
        <section className="bg-black px-5 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold-bright)]">Our journey</p>
            <h1 className="mt-5 max-w-5xl text-7xl leading-[0.8] md:text-9xl">
              {settings?.about_title || "Built around the woman, not the size chart."}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Why Svastida</p>
              <h2 className="mt-4 text-6xl leading-[0.9]">Personal style deserves personal attention.</h2>
            </div>
            <div className="text-base leading-8 text-black/60 md:text-lg">
              <p>{settings?.about_content || "Your brand story will appear here once it is added from the admin settings."}</p>
            </div>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {milestones.map(([number, title, body]) => (
              <article key={number} className="border-t border-black/15 pt-6">
                <span className="text-sm text-[var(--gold)]">{number}</span>
                <h3 className="mt-8 text-4xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/50">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
