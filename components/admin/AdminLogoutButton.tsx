"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="absolute bottom-16 left-6 text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black"
    >
      Sign out
    </button>
  );
}
