import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">404</p>
        <h1 className="mt-3 text-5xl display-font">This page took a wrong turn.</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm text-white">
          Back home
        </Link>
      </div>
    </main>
  );
}
