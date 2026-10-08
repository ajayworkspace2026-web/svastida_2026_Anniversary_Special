import type { ProductListItem } from "@/lib/types";

type ProductRow = ProductListItem & {
  product_images?: Array<{
    storage_path: string;
    is_primary: boolean;
  }>;
};

function getConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function storagePublicUrl(path: string | null, bucket = "product-images") {
  if (!path) return null;
  const { url } = getConfig();
  if (!url) return null;
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

async function rest<T>(path: string): Promise<T | null> {
  const { url, anonKey } = getConfig();
  if (!url || !anonKey) return null;

  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

function mapProduct(row: ProductRow): ProductListItem {
  const primary =
    row.product_images?.find((image) => image.is_primary) ??
    row.product_images?.[0];

  return {
    ...row,
    image_url: storagePublicUrl(primary?.storage_path ?? null),
  };
}

export async function getFeaturedProducts(limit = 8) {
  const query =
    "products?select=id,slug,name,description,price,sale_price,featured,new_arrival,bestseller,custom_fit,sizes,status,product_images(storage_path,is_primary)&status=eq.active&featured=eq.true&order=created_at.desc&limit=" +
    encodeURIComponent(String(limit));

  const rows = await rest<ProductRow[]>(query);
  return rows?.map(mapProduct) ?? [];
}

export async function getProductBySlug(slug: string) {
  const query =
    "products?select=id,slug,name,description,price,sale_price,featured,new_arrival,bestseller,custom_fit,sizes,status,custom_measurements_enabled,tags,stock_label,product_images(id,storage_path,alt_text,sort_order,is_primary),size_charts(size_label,bust_min_cm,bust_max_cm,waist_min_cm,waist_max_cm,hips_min_cm,hips_max_cm)&slug=eq." +
    encodeURIComponent(slug) +
    "&status=eq.active&limit=1";

  const rows = await rest<Array<Record<string, unknown>>>(query);
  if (!rows?.[0]) return null;

  const row = rows[0] as Record<string, any>;
  const images = [...(row.product_images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return {
    ...row,
    images: images.map((image: any) => ({
      ...image,
      publicUrl: storagePublicUrl(image.storage_path),
    })),
    sale_price: row.sale_price ?? null,
  };
}

export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export async function getCollections() {
  const rows = await rest<Array<CollectionSummary & { image_url: string | null }>>(
    "collections?select=id,name,slug,description,image_url&is_active=eq.true&order=sort_order.asc",
  );
  return rows ?? [];
}

export async function getCollectionProducts(slug: string) {
  const rows = await rest<ProductRow[]>(
    "products?select=id,slug,name,description,price,sale_price,featured,new_arrival,bestseller,custom_fit,sizes,status,product_images(storage_path,is_primary),collections!inner(slug)&status=eq.active&collections.slug=eq." +
      encodeURIComponent(slug) +
      "&order=created_at.desc",
  );
  return rows?.map(mapProduct) ?? [];
}
