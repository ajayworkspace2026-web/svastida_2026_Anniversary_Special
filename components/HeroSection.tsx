import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(212,175,55,0.22),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div className="max-w-2xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-[var(--gold-bright)]">
            Made for your silhouette
          </p>
          <h1 className="animate-fade-up-delay-1 mt-5 text-7xl leading-[0.82] display-font md:text-9xl">
            Wear what feels like you.
          </h1>
          <p className="animate-fade-up-delay-2 mt-8 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            Discover curated women&apos;s fashion, customise the fit to your measurements,
            and turn your own fabric into a visual dress concept with our AI designer.
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="rounded-full bg-[var(--gold-bright)] px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Explore collection
            </Link>
            <Link
              href="/customise"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-[var(--gold-bright)] hover:text-[var(--gold-bright)]"
            >
              Design with fabric
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden border border-white/10 bg-white/5">
          <div className="absolute inset-5 border border-[var(--gold-bright)]/35" />
          <div className="flex h-full items-end p-8">
            <div className="relative z-10 max-w-xs">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-bright)]">
                The first collection
              </p>
              <p className="mt-4 display-font text-4xl leading-none">
                Quiet luxury with a personal edge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
