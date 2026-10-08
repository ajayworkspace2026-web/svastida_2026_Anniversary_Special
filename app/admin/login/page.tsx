import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-black px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10">
        <Link href="/" className="display-font text-3xl font-semibold">
          SVASTIDA<span className="text-[var(--gold-bright)]">.</span>
        </Link>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Private access</p>
        <h1 className="mt-3 text-5xl leading-[0.9]">Admin sign in.</h1>
        <p className="mt-4 text-sm leading-6 text-black/50">
          Manage products, collections, orders, business settings and storage.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
