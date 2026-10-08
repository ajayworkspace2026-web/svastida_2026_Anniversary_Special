import CollectionManager from "@/components/admin/CollectionManager";

export default function AdminCollectionsPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Catalogue</p>
      <h1 className="mt-3 text-6xl leading-[0.85]">Collections.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">
        Organise published products into collections and control their storefront visibility.
      </p>
      <div className="mt-10"><CollectionManager /></div>
    </div>
  );
}
