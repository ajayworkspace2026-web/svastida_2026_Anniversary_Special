import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StorageDashboard from "@/components/admin/StorageDashboard";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [products, orders, newOrders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const cards = [
    ["Products", products.count ?? 0, "/sree/products"],
    ["Orders", orders.count ?? 0, "/sree/orders"],
    ["New orders", newOrders.count ?? 0, "/sree/orders?status=new"],
  ];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Admin</p>
      <h1 className="mt-3 text-6xl leading-[0.85]">Overview.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">
        Your private control centre for the storefront, catalogue, customer orders and storage.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={String(label)} href={String(href)} className="rounded-2xl bg-white p-7 transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.22em] text-black/40">{label}</p>
            <p className="mt-5 text-5xl display-font">{String(value)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <StorageDashboard />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/sree/products" className="rounded-2xl bg-black p-8 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-bright)]">Catalogue</p>
          <h2 className="mt-3 text-4xl">Manage your products.</h2>
          <p className="mt-3 text-sm text-white/60">Add, edit, price, publish and archive products.</p>
        </Link>
        <Link href="/sree/orders" className="rounded-2xl border border-black/10 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Operations</p>
          <h2 className="mt-3 text-4xl">Stay on top of orders.</h2>
          <p className="mt-3 text-sm text-black/50">Review customer details and update order status.</p>
        </Link>
      </div>
    </div>
  );
}
