import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/customise", label: "Customise" },
  { href: "/about", label: "About" },
];

export default function StorefrontNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="display-font text-3xl font-semibold tracking-wide">
          SVASTIDA<span className="text-[var(--gold-bright)]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="rounded-full border border-black/15 px-4 py-2 text-sm transition hover:border-black hover:bg-black hover:text-white"
          >
            Cart
          </Link>
          <Link
            href="/admin/login"
            className="hidden text-xs uppercase tracking-[0.2em] text-black/45 hover:text-black md:block"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
