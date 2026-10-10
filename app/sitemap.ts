import type { MetadataRoute } from "next";
import { getCollections } from "@/lib/storefront";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const collections = await getCollections();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: base + "/collections", changeFrequency: "daily", priority: 0.9 },
    { url: base + "/customise", changeFrequency: "weekly", priority: 0.8 },
    { url: base + "/about", changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/contact", changeFrequency: "monthly", priority: 0.5 },
    ...collections.map((collection) => ({
      url: base + "/collections/" + collection.slug,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}