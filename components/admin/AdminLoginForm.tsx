"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  adminId: string;
  adminEmail: string;
};

export default function AdminLoginForm({ adminId, adminEmail }: AdminLoginFormProps) {
  const router = useRouter();
  const [loginId, setLoginId] = useState(adminId);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError("");
    setBusy(true);

    try {
      const enteredId = loginId.trim();
      const email = enteredId === adminId && adminEmail ? adminEmail : enteredId;

      if (!email.includes("@")) {
        setError("Admin access is not configured. Set SVASTIDA_ADMIN_EMAIL in the deployment environment.");
        return;
      }

      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid admin credentials.");
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setError("Sign-in succeeded but no user session was returned. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        setError(profileError.message || "Could not verify admin access.");
        return;
      }

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account does not have admin access.");
        return;
      }

      router.replace("/sree/dashboard");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to sign in.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm">
        Admin ID
        <input
          type="text"
          required
          autoComplete="username"
          value={loginId}
          onChange={(event) => setLoginId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-black"
        />
      </label>
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <button
        disabled={busy}
        type="submit"
        className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Signing in..." : "Admin sign in"}
      </button>
    </form>
  );
}
