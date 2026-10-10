export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5f0] px-5 py-16">
      <div className="text-center" aria-label="Loading Svastida">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-[var(--gold)] border-t-black animate-spin" />
        <p className="mt-6 display-font text-4xl">SVASTIDA.</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-black/40">Loading your experience</p>
      </div>
    </main>
  );
}
