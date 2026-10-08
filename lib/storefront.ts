import type { ProductDetail, ProductListItem } from "@/lib/types";

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

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
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
    price: Number(row.price),
    sale_price: row.sale_price == null ? null : Number(row.sale_price),
    featured: Boolean(row.featured),
    new_arrival: Boolean(row.new_arrival),
    bestseller: Boolean(row.bestseller),
    custom_fit: Boolean(row.custom_fit),
    custom_measurements_enabled: Boolean(row.custom_measurements_enabled),
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    stock_label: row.stock_label ?? null,
    images: images.map((image: any) => ({
      id: String(image.id),
      storage_path: String(image.storage_path),
      alt_text: image.alt_text ?? null,
      sort_order: Number(image.sort_order ?? 0),
      is_primary: Boolean(image.is_primary),
      publicUrl: storagePublicUrl(image.storage_path),
    })),
    size_charts: Array.isArray(row.size_charts)
      ? row.size_charts.map((chart: any) => ({
          size_label: String(chart.size_label),
          bust_min_cm: chart.bust_min_cm == null ? null : Number(chart.bust_min_cm),
          bust_max_cm: chart.bust_max_cm == null ? null : Number(chart.bust_max_cm),
          waist_min_cm: chart.waist_min_cm == null ? null : Number(chart.waist_min_cm),
          waist_max_cm: chart.waist_max_cm == null ? null : Number(chart.waist_max_cm),
          hips_min_cm: chart.hips_min_cm == null ? null : Number(chart.hips_min_cm),
          hips_max_cm: chart.hips_max_cm == null ? null : Number(chart.hips_max_cm),
        }))
      : [],
  } as ProductDetail;
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

export async function getCollectionProducts(
  slug: string,
  options: { page?: number; q?: string; sort?: string } = {},
) {
  const pageSize = 12;
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * pageSize;
  const sort =
    options.sort === "price-asc"
      ? "price.asc"
      : options.sort === "price-desc"
        ? "price.desc"
        : "created_at.desc";

  const search = options.q?.trim()
    ? "&name=ilike.*" + encodeURIComponent(options.q.trim()) + "*"
    : "";

  const query =
    "products?select=id,slug,name,description,price,sale_price,featured,new_arrival,bestseller,custom_fit,sizes,status,product_images(storage_path,is_primary),collections!inner(slug)&status=eq.active&collections.slug=eq." +
    encodeURIComponent(slug) +
    search +
    "&order=" +
    sort +
    "&offset=" +
    offset +
    "&limit=" +
    pageSize;

  const result = await rest<ProductRow[]>(query);
  const items = result?.map(mapProduct) ?? [];

  return {
    items,
    page,
    pageSize,
    hasNext: items.length === pageSize,
  };
}

export async function getSiteSettings() {
  const rows = await rest<Array<{
    brand_name: string;
    whatsapp_admin_number: string | null;
    business_email: string | null;
    business_phone: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    address: string | null;
    about_title: string | null;
    about_content: string | null;
  }>>("site_settings?select=brand_name,whatsapp_admin_number,business_email,business_phone,instagram_url,facebook_url,address,about_title,about_content&id=eq.true&limit=1");

  return rows?.[0] ?? null;
}
