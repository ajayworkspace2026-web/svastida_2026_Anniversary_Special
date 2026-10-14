"use client";

import Link from "next/link";

type Collection = {
  name: string;
  slug: string;
};

export default function AtelierShowroom({ collections }: { collections: Collection[] }) {
  const fallback = [
    { name: "The Anarkali", slug: "anarkali" },
    { name: "The Gown", slug: "gown" },
    { name: "The Lehenga", slug: "lehenga" },
  ];
  const items = [...collections.slice(0, 3), ...fallback].slice(0, 3);

  return (
    <section className="overflow-hidden bg-[#f3efe7] px-5 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">The digital showroom</p>
            <h2 className="mt-4 max-w-2xl text-6xl leading-[0.9] tracking-[-0.025em]">
              See the silhouette
              <br />
              before you choose it.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-black/50">
            Hover across the garments to shift the perspective, then open a collection to continue into the catalogue.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_50%_25%,#fff,#e6ddd0_62%,#d7cebf)] p-5 md:p-10">
          <div className="grid min-h-[470px] items-end gap-6 [perspective:1200px] md:grid-cols-3">
            {items.map((item, index) => {
              const isFallback = index >= collections.length;
              const itemHref = isFallback ? "/collections" : "/collections/" + item.slug;
              const itemKey = item.slug + "-" + index;

              return (
                <Link
                  key={itemKey}
                  href={itemHref}
                  className="group relative flex min-h-[410px] items-end justify-center overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/35 p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-2"
                >
                  <div
                    className="absolute left-1/2 top-[15%] h-[64%] w-[52%] -translate-x-1/2 [transform-style:preserve-3d] transition-transform duration-700 group-hover:rotate-y-[-12deg] group-hover:rotate-x-[2deg]"
                  >
                    <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-[#d4b091] shadow-xl" />
                    <div className="absolute left-1/2 top-14 h-12 w-14 -translate-x-1/2 rounded-b-[45%] bg-[#cfaa8e]" />
                    <div className="absolute left-1/2 top-24 h-[30%] w-[54%] -translate-x-1/2 rounded-t-[38%] bg-[#efe6d8] shadow-xl" />
                    <div className="absolute bottom-0 left-1/2 h-[68%] w-full -translate-x-1/2 [clip-path:polygon(34%_0,66%_0,74%_13%,82%_30%,92%_62%,100%_100%,0_100%,8%_62%,18%_30%,26%_13%)] bg-[linear-gradient(105deg,#c7aa78,#f1e4cf_42%,#ad8e5e)] shadow-[22px_30px_45px_rgba(0,0,0,.2)]" />
                  </div>

                  <div className="relative z-10 w-full rounded-2xl border border-black/10 bg-white/72 p-4 shadow-[0_16px_40px_rgba(0,0,0,.09)] backdrop-blur-md">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-black/35">0{index + 1}</span>
                    <span className="mt-2 block truncate display-font text-2xl">{item.name}</span>
                    <span className="mt-1 block text-xs text-black/45">Enter collection →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <span className="absolute left-8 top-8 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-black/45 backdrop-blur-md">
            CSS 3D showroom
          </span>
        </div>
      </div>
    </section>
  );
}
