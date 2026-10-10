"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5f0] px-5 py-16 text-center">
      <div className="max-w-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Svastida</p>
        <h1 className="mt-4 text-6xl leading-none">Something went wrong.</h1>
        <p className="mt-5 text-sm leading-7 text-black/55">
          We could not load this page right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}