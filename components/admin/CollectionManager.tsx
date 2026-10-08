"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

const blank = { id: "", name: "", slug: "", description: "", sortOrder: "0", isActive: true };

export default function CollectionManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Collection[]>([]);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function load() {
    const { data } = await supabase
      .from("collections")
      .select("id,name,slug,description,is_active,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Collection[]);
  }

  useEffect(() => { void load(); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      const payload = {
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        description: form.description.trim() || null,
        sort_order: Number(form.sortOrder) || 0,
        is_active: form.isActive,
      };
      if (!payload.name) throw new Error("Collection name is required.");

      const response = form.id
        ? await supabase.from("collections").update(payload).eq("id", form.id)
        : await supabase.from("collections").insert(payload);

      if (response.error) throw response.error;

      if (image) {
        const row = form.id
          ? form.id
          : ((await supabase.from("collections").select("id").eq("slug", payload.slug).single()).data?.id ?? "");
        if (!row) throw new Error("Collection saved but its image could not be linked.");
        const ext = image.name.split(".").pop()?.toLowerCase() ?? "webp";
        const path = `collections/${row}/${crypto.randomUUID()}.${ext}`;
        const upload = await supabase.storage.from("collection-images").upload(path, image, {
          contentType: image.type,
          cacheControl: "31536000",
          upsert: false,
        });
        if (upload.error) throw upload.error;
        const publicUrl = supabase.storage.from("collection-images").getPublicUrl(path).data.publicUrl;
        const { error: urlError } = await supabase.from("collections").update({ image_url: publicUrl }).eq("id", row);
        if (urlError) throw urlError;
      }

      setMessage(form.id ? "Collection updated." : "Collection created.");
      setForm(blank);
      setImage(null);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save collection.");
    }
  }

  async function archive(id: string) {
    const { error } = await supabase.from("collections").update({ is_active: false }).eq("id", id);
    setMessage(error ? error.message : "Collection hidden from storefront.");
    await load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="rounded-2xl bg-white p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{form.id ? "Edit" : "New"}</p>
        <h2 className="mt-2 text-4xl">{form.id ? "Update collection." : "Create a collection."}</h2>
        <div className="mt-7 space-y-4">
          <label className="block text-sm">Name<input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          <label className="block text-sm">Slug<input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          <label className="block text-sm">Description<textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          <label className="block text-sm">Sort order<input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          <label className="block text-sm">Collection image
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-dashed border-black/15 px-4 py-4 text-sm" />
          </label>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Visible on storefront</label>
        </div>
        {message ? <p className="mt-5 rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm">{message}</p> : null}
        <div className="mt-5 flex gap-2">
          <button type="submit" className="flex-1 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white">{form.id ? "Update" : "Create"}</button>
          {form.id ? <button type="button" onClick={() => setForm(blank)} className="rounded-full border border-black/15 px-5 py-3.5 text-sm">Cancel</button> : null}
        </div>
      </form>

      <section className="rounded-2xl bg-white">
        <div className="border-b border-black/10 p-6"><h2 className="text-3xl">Collections.</h2></div>
        <div className="divide-y divide-black/10">
          {!rows.length ? <div className="p-6 text-sm text-black/40">No collections yet.</div> : null}
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="display-font text-2xl">{row.name}</p>
                <p className="mt-1 text-xs text-black/40">{row.slug} · order {row.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ id: row.id, name: row.name, slug: row.slug, description: row.description ?? "", sortOrder: String(row.sort_order), isActive: row.is_active }); setImage(null)} className="rounded-full border border-black/15 px-4 py-2 text-xs">Edit</button>
                {row.is_active ? <button type="button" onClick={() => archive(row.id)} className="rounded-full border border-black/15 px-4 py-2 text-xs">Hide</button> : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
