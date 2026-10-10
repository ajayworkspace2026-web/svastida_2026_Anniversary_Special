import type { MetadataRoute } from "next";
import { getActiveProductSlugs, getCollections } from "@/lib/storefront";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [collections, products] = await Promise.all([
    getCollections(),
    getActiveProductSlugs(),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: base + "/collections", changeFrequency: "daily", priority: 0.9 },
    { url: base + "/customise", changeFrequency: "weekly", priority: 0.8 },
    { url: base + "/about", changeFrequency: "monthly", priority: 0.6 },
    { url: base + "/contact", changeFrequency: "monthly", priority: 0.6 },
    { url: base + "/shipping", changeFrequency: "monthly", priority: 0.4 },
    { url: base + "/returns", changeFrequency: "monthly", priority: 0.4 },
    { url: base + "/privacy", changeFrequency: "monthly", priority: 0.4 },
    ...collections.map((collection) => ({
      url: base + "/collections/" + collection.slug,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: base + "/product/" + product.slug,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
