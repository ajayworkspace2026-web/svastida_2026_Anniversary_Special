import Link from "next/link";

export default function StorefrontFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-5 py-12 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="display-font text-3xl font-semibold">SVASTIDA.</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/50">
            Custom women&apos;s fashion with a direct, personal ordering experience.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">Explore</p>
          <div className="mt-4 space-y-3 text-sm text-black/65">
            <Link className="block hover:text-black" href="/collections">Collections</Link>
            <Link className="block hover:text-black" href="/customise">Customise</Link>
            <Link className="block hover:text-black" href="/about">About</Link>
            <Link className="block hover:text-black" href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">Store policy</p>
          <div className="mt-4 space-y-3 text-sm text-black/65">
            <Link className="block hover:text-black" href="/shipping">Shipping</Link>
            <Link className="block hover:text-black" href="/returns">Returns</Link>
            <Link className="block hover:text-black" href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-black/10 pt-6 text-xs text-black/35">
        © {new Date().getFullYear()} Svastida. All rights reserved.
      </div>
    </footer>
  );
}
