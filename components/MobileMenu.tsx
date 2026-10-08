"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/customise", label: "Customise" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-10 place-items-center rounded-full border border-black/15 text-lg"
      >
        {open ? "×" : "☰"}
      </button>

      {open ? (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-black/10 bg-white px-5 py-5 shadow-sm">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f7f5f0]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-3 block border-t border-black/10 px-4 pt-4 text-xs uppercase tracking-[0.2em] text-black/45"
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
