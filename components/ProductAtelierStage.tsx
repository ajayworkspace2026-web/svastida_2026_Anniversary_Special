"use client";

import { useState } from "react";

type Props = {
  name: string;
  imageUrl: string | null;
  collectionName?: string | null;
};

export default function ProductAtelierStage({ name, imageUrl, collectionName }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -4, y: x * 8 });
  }

  return (
    <div
      className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#111] [perspective:1200px]"
      onPointerMove={move}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(214,184,110,.2),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,.07),transparent_32%)]" />
      <div
        className="absolute inset-10 rounded-[50%] border border-white/10 bg-white/[0.025] transition-transform duration-500"
        style={{ transform: "rotateX(" + tilt.x + "deg) rotateY(" + tilt.y + "deg)" }}
      >
        <div className="absolute inset-8 overflow-hidden rounded-[44%] border border-[#d2b56b]/20 bg-[linear-gradient(140deg,#151515,#242018_52%,#0e0e0e)] shadow-[0_30px_100px_rgba(0,0,0,.5)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-[11%] h-[78%] w-[78%] object-contain opacity-80 mix-blend-screen transition-transform duration-700"
              style={{ transform: "scale(1.03) rotate(" + tilt.y * 0.18 + "deg)" }}
            />
          ) : (
            <div className="absolute left-1/2 top-[11%] h-[78%] w-[52%] -translate-x-1/2">
              <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-[#d4af91]" />
              <div className="absolute left-1/2 top-14 h-12 w-14 -translate-x-1/2 rounded-b-[40%] bg-[#d0a88c]" />
              <div className="absolute left-1/2 top-24 h-[65%] w-full -translate-x-1/2 [clip-path:polygon(32%_0,68%_0,76%_16%,86%_42%,100%_100%,0_100%,14%_42%,24%_16%)] bg-[linear-gradient(105deg,#b99861,#f0e5d2_48%,#b18f5a)] shadow-[22px_25px_50px_rgba(0,0,0,.4)]" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-7 top-7 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/45 backdrop-blur-md">
        {collectionName || "Svastida Atelier"}
      </div>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#d2b56b]">Interactive product view</p>
          <p className="mt-2 max-w-sm display-font text-3xl text-white">{name}</p>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md sm:block">
          Move to explore
        </span>
      </div>
    </div>
  );
}
