export default function HomePage() {
  return (
    <main>
      <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <p className="mb-5 uppercase tracking-[0.35em] text-sm text-[var(--gold-bright)]">
            Svastida
          </p>
          <h1 className="text-6xl md:text-8xl font-medium leading-none">
            Custom fashion, designed around you.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-white/70 text-base md:text-lg">
            A premium women&apos;s fashion experience for ready-to-wear,
            custom-fit and AI-assisted design concepts.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#collections"
              className="rounded-full bg-[var(--gold-bright)] px-7 py-3 font-semibold text-black"
            >
              Explore collection
            </a>
            <a
              href="/customise"
              className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white"
            >
              Design with your fabric
            </a>
          </div>
        </div>
      </section>

      <section id="collections" className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">
            Foundation phase
          </p>
          <h2 className="mt-3 text-5xl md:text-6xl">Storefront coming together</h2>
          <p className="mt-5 max-w-2xl text-[var(--muted)]">
            The repository foundation is in place. Dynamic products, collections,
            customer checkout, WhatsApp ordering, admin controls and AI design
            generation are being added as separate production-tested phases.
          </p>
        </div>
      </section>
    </main>
  );
}
