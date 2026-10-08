import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const adminId = process.env.SVASTIDA_ADMIN_ID ?? "Svastida@2026";
  const adminEmail = process.env.SVASTIDA_ADMIN_EMAIL ?? "";

  return (
    <main className="grid min-h-screen place-items-center bg-black px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10">
        <Link href="/" className="display-font text-3xl font-semibold">
          SVASTIDA<span className="text-[var(--gold-bright)]">.</span>
        </Link>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Private access</p>
        <h1 className="mt-3 text-5xl leading-[0.9]">Admin sign in.</h1>
        <p className="mt-4 text-sm leading-6 text-black/50">
          Private control centre for the Svastida storefront.
        </p>
        <div className="mt-8">
          <AdminLoginForm adminId={adminId} adminEmail={adminEmail} />
        </div>
      </div>
    </main>
  );
}
