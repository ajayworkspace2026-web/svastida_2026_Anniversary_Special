import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await authClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Server storage credentials are not configured.");

    const service = createServiceClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const buckets = [
      ["product-images", "product_image_bytes"],
      ["collection-images", "collection_image_bytes"],
      ["ai-designs", "ai_output_bytes"],
    ] as const;

    let total = 0;
    let fileCount = 0;
    const breakdown: Record<string, number> = {};

    for (const [bucket, key] of buckets) {
      const { data, error } = await service
        .from("objects")
        .select("metadata")
        .eq("bucket_id", bucket);

      if (error) continue;

      const bytes = (data ?? []).reduce((sum, object) => {
        const size = Number((object.metadata as Record<string, unknown> | null)?.size ?? 0);
        return sum + (Number.isFinite(size) ? size : 0);
      }, 0);

      breakdown[key] = bytes;
      total += bytes;
      fileCount += data?.length ?? 0;
    }

    const { data: settings } = await service
      .from("site_settings")
      .select("storage_limit_bytes")
      .eq("id", true)
      .single();

    const limit = Number(settings?.storage_limit_bytes ?? 0);

    return NextResponse.json({
      totalBytes: total,
      fileCount,
      limitBytes: limit,
      breakdown,
      percentage: limit > 0 ? Math.min(100, (total / limit) * 100) : null,
      measuredAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read storage usage." },
      { status: 500 },
    );
  }
}
