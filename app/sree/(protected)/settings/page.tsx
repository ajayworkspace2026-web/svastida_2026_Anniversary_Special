"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StorageDashboard from "@/components/admin/StorageDashboard";
import AboutStoryManager from "@/components/admin/AboutStoryManager";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    brandName: "Svastida",
    whatsappNumber: "",
    businessEmail: "",
    businessPhone: "",
    instagram: "",
    facebook: "",
    address: "",
    aboutTitle: "",
    aboutContent: "",
    storageLimitGB: "16",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
      if (data) {
        setForm({
          brandName: data.brand_name ?? "Svastida",
          whatsappNumber: data.whatsapp_admin_number ?? "",
          businessEmail: data.business_email ?? "",
          businessPhone: data.business_phone ?? "",
          instagram: data.instagram_url ?? "",
          facebook: data.facebook_url ?? "",
          address: data.address ?? "",
          aboutTitle: data.about_title ?? "",
          aboutContent: data.about_content ?? "",
          storageLimitGB: String((Number(data.storage_limit_bytes) / 1024 ** 3).toFixed(2)),
        });
      }
      setBusy(false);
    }
    void load();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const storageGB = Number(form.storageLimitGB);

    const { error } = await supabase
      .from("site_settings")
      .update({
        brand_name: form.brandName.trim() || "Svastida",
        whatsapp_admin_number: form.whatsappNumber.trim() || null,
        business_email: form.businessEmail.trim() || null,
        business_phone: form.businessPhone.trim() || null,
        instagram_url: form.instagram.trim() || null,
        facebook_url: form.facebook.trim() || null,
        address: form.address.trim() || null,
        about_title: form.aboutTitle.trim() || null,
        about_content: form.aboutContent.trim() || null,
        storage_limit_bytes:
          Number.isFinite(storageGB) && storageGB > 0
            ? Math.round(storageGB * 1024 ** 3)
            : 16 * 1024 ** 3,
      })
      .eq("id", true);

    setMessage(error ? error.message : "Settings saved.");
    setSaving(false);
  }

  if (busy) return <p className="text-sm text-black/40">Loading settings...</p>;

  return (
    <div className="max-w-4xl">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Business controls</p>
      <h1 className="mt-3 text-6xl leading-[0.85]">Settings.</h1>

      <form onSubmit={save} className="mt-10 space-y-7 rounded-2xl bg-white p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["brandName", "Brand name"],
            ["whatsappNumber", "Admin WhatsApp number"],
            ["businessEmail", "Business email"],
            ["businessPhone", "Business phone"],
            ["instagram", "Instagram URL"],
            ["facebook", "Facebook URL"],
          ].map(([key, label]) => (
            <label key={key} className="text-sm">
              {label}
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
              />
            </label>
          ))}
        </div>

        <label className="block text-sm">
          Business address
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
          />
        </label>

        <div className="border-t border-black/10 pt-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">About page copy</p>
          <div className="mt-5 space-y-4">
            <label className="block text-sm">
              Title
              <input
                value={form.aboutTitle}
                onChange={(e) => setForm((f) => ({ ...f, aboutTitle: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
              />
            </label>
            <label className="block text-sm">
              Story
              <textarea
                rows={8}
                value={form.aboutContent}
                onChange={(e) => setForm((f) => ({ ...f, aboutContent: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
              />
            </label>
          </div>
        </div>

        {message ? <p className="rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm">{message}</p> : null}

        <button
          disabled={saving}
          type="submit"
          className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>

      <div className="mt-6">
        <AboutStoryManager />
      </div>

      <div className="mt-6">
        <StorageDashboard />
      </div>
    </div>
  );
}
