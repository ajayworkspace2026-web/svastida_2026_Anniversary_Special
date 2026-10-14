"use client";

import Link from "next/link";
import { useRef } from "react";

export default function AtelierHero() {
  const stageRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.style.setProperty("--rotate-y", String(x * 10));
    stage.style.setProperty("--rotate-x", String(y * -4));
    stage.style.setProperty("--glow-x", String(50 + x * 18) + "%");
    stage.style.setProperty("--glow-y", String(42 + y * 12) + "%");
  }

  function resetPointer() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--rotate-y", "0");
    stage.style.setProperty("--rotate-x", "0");
    stage.style.setProperty("--glow-x", "62%");
    stage.style.setProperty("--glow-y", "42%");
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#0b0b0b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(210,181,107,.2),transparent_24%),radial-gradient(circle_at_10%_85%,rgba(255,255,255,.06),transparent_30%)]" />
      <div className="absolute left-6 top-24 z-20 md:left-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d2b56b]">Svastida Atelier / 2026</p>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center px-6 pb-14 pt-28 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <div className="max-w-xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-[#d2b56b]">
            Fashion in your hands
          </p>
          <h1 className="animate-fade-up-delay-1 mt-5 text-7xl leading-[0.82] tracking-[-0.04em] sm:text-8xl md:text-[7.2rem]">
            Wear the
            <br />
            <span className="text-[#e8d5ae]">extraordinary.</span>
          </h1>
          <p className="animate-fade-up-delay-2 mt-7 max-w-md text-sm leading-7 text-white/65 md:text-base">
            A digital atelier for expressive Indian fashion — discover curated pieces, shape your fit,
            and turn your own fabric into a new silhouette.
          </p>

          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="rounded-full bg-[#ead9b5] px-7 py-3.5 text-sm font-semibold text-[#111] transition hover:-translate-y-1"
            >
              Explore collections
            </Link>
            <Link
              href="/customise"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
            >
              Create with my fabric
            </Link>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            <span>Curated</span>
            <span>Custom fit</span>
            <span>AI assisted</span>
          </div>
        </div>

        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          className="relative mt-8 h-[58vh] min-h-[480px] [perspective:1200px] md:mt-0 md:h-[76vh]"
          style={
            {
              "--rotate-y": "0",
              "--rotate-x": "0",
              "--glow-x": "62%",
              "--glow-y": "42%",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute inset-0 transition-[filter] duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(calc(var(--rotate-x) * 1deg)) rotateY(calc(var(--rotate-y) * 1deg))",
            }}
          >
            <div
              className="absolute left-1/2 top-[10%] h-[72%] w-[72%] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(224,194,124,.35), transparent 45%)",
              }}
            />

            <div className="absolute left-1/2 top-[8%] h-[78%] w-[70%] -translate-x-1/2 rounded-[50%] border border-white/10 bg-white/[0.025] shadow-[0_40px_100px_rgba(0,0,0,.35)] [transform:translateZ(-60px)_rotateY(-7deg)]" />

            <div className="absolute bottom-[7%] left-1/2 h-8 w-[54%] -translate-x-1/2 rounded-full border border-[#d2b56b]/30 bg-[#c5a45f]/10 blur-[1px] [transform:translateZ(-20px)]" />

            <div className="absolute left-1/2 top-[12%] h-[72%] w-[46%] -translate-x-1/2 [transform-style:preserve-3d] [transform:translateZ(80px)_rotateY(-4deg)] transition-transform duration-500">
              <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ead5bd,#bf9875_72%)] shadow-[18px_18px_45px_rgba(0,0,0,.28)]" />
              <div className="absolute left-1/2 top-[72px] h-10 w-12 -translate-x-1/2 rounded-b-[45%] bg-[#d3af92]" />

              <div className="absolute left-1/2 top-[82px] h-[55%] w-[60%] -translate-x-1/2 rounded-t-[38%] bg-[linear-gradient(115deg,#f3e8d7,#d4bf9d_45%,#f0e3ca)] shadow-[25px_28px_50px_rgba(0,0,0,.3)]" />

              <div className="absolute left-[9%] top-[90px] h-40 w-10 -rotate-[16deg] rounded-full bg-[#d0aa8c] shadow-lg" />
              <div className="absolute right-[9%] top-[90px] h-40 w-10 rotate-[16deg] rounded-full bg-[#d0aa8c] shadow-lg" />

              <div className="absolute bottom-[4%] left-1/2 h-[58%] w-[94%] -translate-x-1/2 [clip-path:polygon(35%_0,65%_0,72%_13%,79%_27%,90%_56%,100%_100%,0_100%,10%_56%,21%_27%,28%_13%)] bg-[linear-gradient(107deg,#c8aa78,#f2e7d2_42%,#d3bb91_70%,#a98b5e)] shadow-[30px_38px_50px_rgba(0,0,0,.35)]" />

              <div className="absolute bottom-[9%] left-1/2 h-24 w-[100%] -translate-x-1/2 [transform:translateZ(18px)]">
                <div className="absolute left-[8%] top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-[#e9d8ae]/60" />
                <div className="absolute right-[8%] top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border border-[#e9d8ae]/60" />
                <div className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2 bg-[#ecd9ad]/45" />
              </div>
            </div>

            <div className="absolute left-[10%] top-[16%] rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/45 backdrop-blur-md [transform:translateZ(90px)_rotateY(7deg)]">
              Interactive silhouette
            </div>

            <div className="absolute bottom-[16%] right-[7%] rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl [transform:translateZ(110px)_rotateY(-5deg)]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#d2b56b]">Atelier note</p>
              <p className="mt-2 max-w-[170px] text-sm leading-6 text-white/65">Move across the mannequin to change the light and angle.</p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-white/25">
            Move your cursor
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d2b56b]/50 to-transparent" />
    </section>
  );
}
