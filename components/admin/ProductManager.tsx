"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import type { ProductStatus } from "@/lib/types";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  status: ProductStatus;
  sizes: string[];
  custom_fit: boolean;
  custom_measurements_enabled: boolean;
  featured: boolean;
  new_arrival: boolean;
  bestseller: boolean;
  collection_id: string | null;
};

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  salePrice: "",
  sizes: "S,M,L,XL",
  status: "draft" as ProductStatus,
  customFit: false,
  customMeasurements: false,
  featured: false,
  newArrival: false,
  bestseller: false,
  collectionId: "",
};

export default function ProductManager() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id,slug,name,description,price,sale_price,status,sizes,custom_fit,custom_measurements_enabled,featured,new_arrival,bestseller,collection_id")
      .order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    const { data: collectionRows } = await supabase.from("collections").select("id,name").order("sort_order", { ascending: true });
    setCollections(collectionRows ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  function edit(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      salePrice: product.sale_price == null ? "" : String(product.sale_price),
      sizes: product.sizes.join(","),
      status: product.status,
      customFit: product.custom_fit,
      customMeasurements: product.custom_measurements_enabled,
      featured: product.featured,
      newArrival: product.new_arrival,
      bestseller: product.bestseller,
      collectionId: product.collection_id ?? "",
    });
    setImage(null);
    setMessage("");
  }

  function reset() {
    setForm(emptyForm);
    setImage(null);
    setMessage("");
  }

  async function uploadImage(file: File, productId: string) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "webp";
    const path = `products/${productId}/${crypto.randomUUID()}.${extension}`;

    const upload = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

    if (upload.error) throw upload.error;

    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      alt_text: form.name,
      sort_order: 0,
      is_primary: true,
      asset_size_bytes: file.size,
    });

    if (imageError) throw imageError;

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId)
      .neq("storage_path", path);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const name = form.name.trim();
      const price = Number(form.price);
      const salePrice = form.salePrice.trim() ? Number(form.salePrice) : null;

      if (!name || !Number.isFinite(price) || price < 0) throw new Error("Enter a valid product name and price.");
      if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0 || salePrice > price)) {
        throw new Error("Sale price must be valid and cannot exceed the regular price.");
      }

      const payload = {
        name,
        slug: slugify(form.slug || name),
        description: form.description.trim(),
        price,
        sale_price: salePrice,
        sizes: form.sizes.split(",").map((value) => value.trim()).filter(Boolean),
        status: form.status,
        custom_fit: form.customFit,
        custom_measurements_enabled: form.customMeasurements,
        featured: form.featured,
        new_arrival: form.newArrival,
        bestseller: form.bestseller,
        collection_id: form.collectionId || null,
      };

      let productId = form.id;

      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error || !data) throw error ?? new Error("Could not create the product.");
        productId = data.id;
      }

      if (image && productId) await uploadImage(image, productId);

      setMessage(form.id ? "Product updated." : "Product created.");
      reset();
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function archive(productId: string) {
    setMessage("");
    const { error } = await supabase.from("products").update({ status: "archived" }).eq("id", productId);
    setMessage(error ? error.message : "Product archived.");
    await load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{form.id ? "Edit product" : "New product"}</p>
            <h2 className="mt-2 text-4xl">{form.id ? "Update the details." : "Add a piece."}</h2>
          </div>
          {form.id ? <button type="button" onClick={reset} className="text-xs underline">Cancel</button> : null}
        </div>

        <div className="mt-7 space-y-4">
          <label className="block text-sm">Name<input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          <label className="block text-sm">Slug<input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" placeholder="auto-generated-from-name" /></label>
          <label className="block text-sm">Description<textarea rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Price<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
            <label className="block text-sm">Sale price<input type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" /></label>
          </div>

          <label className="block text-sm">Sizes<input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3" placeholder="XS,S,M,L,XL" /></label>
          <label className="block text-sm">Collection
            <select value={form.collectionId} onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3">
              <option value="">No collection</option>
              {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["customFit", "Custom fit"],
              ["customMeasurements", "Custom measurements"],
              ["featured", "Featured"],
              ["newArrival", "New arrival"],
              ["bestseller", "Bestseller"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof typeof form])}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>

          <label className="block text-sm">Status
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3">
              <option value="draft">Draft</option>
              <option value="active">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="block text-sm">Primary image
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-dashed border-black/15 px-4 py-4 text-sm" />
          </label>
        </div>

        {message ? <p className="mt-5 rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm">{message}</p> : null}

        <button disabled={saving} type="submit" className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : form.id ? "Update product" : "Create product"}
        </button>
      </form>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Catalogue</p>
            <h2 className="mt-2 text-4xl">Products.</h2>
          </div>
          <span className="text-sm text-black/40">{products.length} total</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white">
          {loading ? <div className="p-8 text-sm text-black/40">Loading products...</div> : null}
          {!loading && !products.length ? <div className="p-8 text-sm text-black/40">No products yet.</div> : null}
          {!loading && products.length ? (
            <div className="divide-y divide-black/10">
              {products.map((product) => (
                <article key={product.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg display-font">{product.name}</p>
                    <p className="mt-1 text-xs text-black/45">{product.slug} · ₹{Number(product.sale_price ?? product.price).toLocaleString("en-IN")} · {product.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => edit(product)} className="rounded-full border border-black/15 px-4 py-2 text-xs">Edit</button>
                    {product.status !== "archived" ? <button type="button" onClick={() => archive(product.id)} className="rounded-full border border-black/15 px-4 py-2 text-xs">Archive</button> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
