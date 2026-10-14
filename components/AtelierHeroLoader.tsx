"use client";

import dynamic from "next/dynamic";

const AtelierHero = dynamic(() => import("@/components/AtelierHero"), {
  ssr: false,
  loading: () => (
    <section className="min-h-[92vh] bg-[#0d0d0d] text-white">
      <div className="mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 md:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#d2b56b]">Svastida Atelier / 2026</p>
          <h1 className="mt-5 max-w-3xl text-7xl leading-[0.84] md:text-[7rem]">
            Wear the <span className="text-[#e8d5ae]">extraordinary.</span>
          </h1>
          <p className="mt-6 text-sm text-white/45">Entering the digital atelier…</p>
        </div>
      </div>
    </section>
  ),
});

export default function AtelierHeroLoader() {
  return <AtelierHero />;
}
