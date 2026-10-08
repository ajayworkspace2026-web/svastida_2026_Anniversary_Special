export default function CustomisePage() {
  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">
          AI fashion designer
        </p>
        <h1 className="mt-3 text-5xl md:text-7xl">Design with your fabric.</h1>
        <p className="mt-6 max-w-2xl text-[var(--muted)]">
          Upload a fabric image and generate visual dress concepts. The production
          generation pipeline will be connected in the AI phase.
        </p>
      </div>
    </main>
  );
}
