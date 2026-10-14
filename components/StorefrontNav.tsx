import Link from "next/link";
import CartLink from "@/components/cart/CartLink";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/customise", label: "Customise" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function StorefrontNav({ immersive = false }: { immersive?: boolean }) {
  return (
    <header
      className={
        immersive
          ? "absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-black/15 text-white backdrop-blur-md"
          : "sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur"
      }
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="display-font text-3xl font-semibold tracking-wide">
          SVASTIDA<span className="text-[var(--gold-bright)]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={immersive ? "text-white/75 transition-colors hover:text-white" : "transition-colors hover:text-[var(--gold)]"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartLink />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
