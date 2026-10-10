"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AboutImage = {
  id: string;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

const emptyForm = { id: "", title: "", altText: "", sortOrder: "0" };

export default function AboutStoryManager() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<AboutImage[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("about_images")
      .select("id,storage_path,title,alt_text,sort_order,is_active,created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) setMessage(error.message);
    setRows((data ?? []) as AboutImage[]);
  }, [supabase]);

  useEffect(() => {
    // The gallery is external Supabase data; load it once when the admin view mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function publicUrl(path: string) {
    return supabase.storage.from("about-images").getPublicUrl(path).data.publicUrl;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (!form.id && !image) throw new Error("Choose an image first.");
      if (image && image.size > 10 * 1024 * 1024) {
        throw new Error("About image must be 10 MB or smaller.");
      }

      if (image) {
        const extension = image.name.split(".").pop()?.toLowerCase() ?? "webp";
        const path = `about/${crypto.randomUUID()}.${extension}`;
        const upload = await supabase.storage.from("about-images").upload(path, image, {
          contentType: image.type,
          cacheControl: "31536000",
          upsert: false,
        });
        if (upload.error) throw upload.error;

        const { error } = await supabase.from("about_images").insert({
          storage_path: path,
          title: form.title.trim() || null,
          alt_text: form.altText.trim() || form.title.trim() || "Svastida story image",
          sort_order: Number(form.sortOrder) || 0,
          is_active: true,
        });

        if (error) {
          await supabase.storage.from("about-images").remove([path]);
          throw error;
        }
      } else if (form.id) {
        const { error } = await supabase
          .from("about_images")
          .update({
            title: form.title.trim() || null,
            alt_text: form.altText.trim() || form.title.trim() || "Svastida story image",
            sort_order: Number(form.sortOrder) || 0,
          })
          .eq("id", form.id);

        if (error) throw error;
      }

      setMessage(form.id ? "About image updated." : "About image uploaded.");
      setForm(emptyForm);
      setImage(null);
      setInputKey((value) => value + 1);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the About image.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(row: AboutImage) {
    const { error } = await supabase
      .from("about_images")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    setMessage(error ? error.message : row.is_active ? "Image hidden from the About page." : "Image visible on the About page.");
    await load();
  }

  async function remove(row: AboutImage) {
    if (!window.confirm("Delete this About image permanently?")) return;

    setBusy(true);
    try {
      const { error } = await supabase.from("about_images").delete().eq("id", row.id);
      if (error) throw error;

      const storage = await supabase.storage.from("about-images").remove([row.storage_path]);
      if (storage.error) {
        setMessage("Image record deleted, but the stored file could not be removed.");
      } else {
        setMessage("About image deleted.");
      }
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete the About image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-7">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">About story gallery</p>
        <h2 className="mt-2 text-4xl">Images.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
          Upload photos for the public About page. Active images appear automatically on the storefront.
        </p>
      </div>

      <form onSubmit={save} className="mt-7 grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Story image
          <input
            key={inputKey}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full rounded-xl border border-dashed border-black/15 px-4 py-4 text-sm"
          />
        </label>
        <label className="block text-sm">
          Title / caption
          <input
            value={form.title}
            onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
            placeholder="Our first studio collection"
          />
        </label>
        <label className="block text-sm">
          Alt text
          <input
            value={form.altText}
            onChange={(event) => setForm((value) => ({ ...value, altText: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
            placeholder="Describe the image"
          />
        </label>
        <label className="block text-sm">
          Display order
          <input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(event) => setForm((value) => ({ ...value, sortOrder: event.target.value }))}
            className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3"
          />
        </label>

        {message ? <p className="md:col-span-2 rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm">{message}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="md:col-span-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving..." : form.id ? "Update image details" : "Upload image"}
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <article key={row.id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0]">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: `url("${publicUrl(row.storage_path)}")` }}
              role="img"
              aria-label={row.alt_text ?? row.title ?? "Svastida story image"}
            />
            <div className="p-4">
              <p className="font-medium">{row.title || "Untitled image"}</p>
              <p className="mt-1 text-xs text-black/40">Order {row.sort_order} · {row.is_active ? "Visible" : "Hidden"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: row.id,
                      title: row.title ?? "",
                      altText: row.alt_text ?? "",
                      sortOrder: String(row.sort_order),
                    })
                  }
                  className="rounded-full border border-black/15 px-4 py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void toggle(row)}
                  className="rounded-full border border-black/15 px-4 py-2 text-xs"
                >
                  {row.is_active ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(row)}
                  className="rounded-full border border-black/15 px-4 py-2 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
