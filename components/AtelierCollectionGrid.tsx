"use client";

import Link from "next/link";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export default function AtelierCollectionGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection, index) => (
        <Link
          key={collection.id}
          href={"/collections/" + collection.slug}
          className="group relative min-h-[510px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#141414] text-white [perspective:1100px]"
        >
          {collection.image_url ? (
            <img
              src={collection.image_url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-65"
            />
          ) : null}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.75))]" />
          <div className="absolute inset-8 rounded-[50%] border border-white/10 bg-white/[0.03] transition duration-700 group-hover:rotate-y-[-7deg] group-hover:rotate-x-[2deg]" />

          <div className="absolute left-1/2 top-[17%] h-[48%] w-[48%] -translate-x-1/2 transition duration-700 group-hover:-translate-y-2 group-hover:scale-[1.04]">
            <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 rounded-full bg-[#d6b393] shadow-xl" />
            <div className="absolute left-1/2 top-12 h-9 w-12 -translate-x-1/2 rounded-b-[40%] bg-[#d0aa8e]" />
            <div className="absolute left-1/2 top-20 h-[74%] w-full -translate-x-1/2 [clip-path:polygon(32%_0,68%_0,76%_14%,87%_43%,100%_100%,0_100%,13%_43%,24%_14%)] bg-[linear-gradient(105deg,#b18e59,#f0e4cf_45%,#b9935c)] shadow-[20px_28px_45px_rgba(0,0,0,.35)]" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-7">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d2b56b]">0{index + 1} / collection</span>
            <h2 className="mt-3 text-5xl capitalize leading-[0.9]">{collection.name}</h2>
            {collection.description ? (
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">{collection.description}</p>
            ) : null}
            <span className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs backdrop-blur-md">
              Enter collection →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
