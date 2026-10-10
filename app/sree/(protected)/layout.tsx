import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const links = [
  ["/sree/dashboard", "Overview"],
  ["/sree/products", "Products"],
  ["/sree/collections", "Collections"],
  ["/sree/orders", "Enquiries"],
  ["/sree/settings", "Settings"],
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sree");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/sree");

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-white p-6 lg:block">
        <Link href="/" className="display-font text-3xl font-semibold">
          SVASTIDA<span className="text-[var(--gold-bright)]">.</span>
        </Link>
        <p className="mt-2 truncate text-xs text-black/40">{profile.full_name || user.email}</p>
        <nav className="mt-12 space-y-1">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-black/65 transition hover:bg-black hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="absolute bottom-8 left-6 text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black">
          View storefront
        </Link>
        <AdminLogoutButton />
      </aside>

      <div className="lg:pl-64">
        <header className="border-b border-black/10 bg-white px-5 py-5 lg:hidden">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link href="/" className="display-font shrink-0 text-2xl font-semibold">SVASTIDA.</Link>
            {links.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap text-xs">{label}</Link>)}
          </div>
        </header>
        <main className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
