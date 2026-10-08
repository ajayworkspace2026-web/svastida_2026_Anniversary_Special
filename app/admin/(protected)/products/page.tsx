import ProductManager from "@/components/admin/ProductManager";

export default function AdminProductsPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Catalogue</p>
      <h1 className="mt-3 text-6xl leading-[0.85]">Products.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">
        Create, edit, price, publish and archive products. Product images are stored in Supabase Storage.
      </p>
      <div className="mt-10"><ProductManager /></div>
    </div>
  );
}
