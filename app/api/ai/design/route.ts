import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Server database credentials are not configured.");
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

function clean(value: FormDataEntryValue | null, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const fabric = form.get("fabric");
    const dressType = clean(form.get("dressType"));
    const sleeve = clean(form.get("sleeve"));
    const neckline = clean(form.get("neckline"));
    const sessionId = clean(form.get("sessionId"), 100);

    if (!(fabric instanceof File)) {
      return NextResponse.json({ error: "Please upload a fabric image." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(fabric.type) || fabric.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image up to 8 MB." }, { status: 400 });
    }

    if (!dressType) {
      return NextResponse.json({ error: "Choose a dress style first." }, { status: 400 });
    }

    const supabase = getServiceClient();

    if (!sessionId) {
      return NextResponse.json({ error: "Design session is missing." }, { status: 400 });
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentGenerations } = await supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .eq("customer_session_id", sessionId)
      .gte("created_at", since);

    if ((recentGenerations ?? 0) >= 3) {
      return NextResponse.json(
        { error: "This design session has reached the daily generation limit. Please try again tomorrow." },
        { status: 429 },
      );
    }

    const apiKey = process.env.AI_PROVIDER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI image generation is not configured yet." }, { status: 503 });
    }

    const model = process.env.AI_IMAGE_MODEL || "gpt-image-2.5-flare";
    const prompt = [
      "Create a fashion design concept using the uploaded fabric as the visual material reference.",
      `Dress type: ${dressType}.`,
      sleeve ? `Sleeve direction: ${sleeve}.` : "",
      neckline ? `Neckline direction: ${neckline}.` : "",
      "Preserve the fabric's visible color, print, texture and motif as closely as possible.",
      "Show a complete women's garment on a tasteful fashion model in a clean studio editorial setting.",
      "Generate a realistic visual concept, not a sewing pattern, technical specification or exact construction plan.",
      "Avoid text, logos, watermarks and invented brand marks.",
    ].filter(Boolean).join(" ");

    const aiForm = new FormData();
    aiForm.append("model", model);
    aiForm.append("image", fabric, fabric.name);
    aiForm.append("prompt", prompt);
    aiForm.append("n", "4");
    aiForm.append("size", "1024x1536");
    aiForm.append("quality", "medium");
    aiForm.append("output_format", "webp");
    aiForm.append("output_compression", "80");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: aiForm,
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: `AI generation failed: ${detail.slice(0, 500)}` },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      data?: Array<{ b64_json?: string }>;
    };

    const outputs = (result.data ?? []).filter((entry) => entry.b64_json);
    if (!outputs.length) {
      return NextResponse.json({ error: "The AI provider returned no designs." }, { status: 502 });
    }

    const sourcePath = `sessions/${sessionId || "anonymous"}/fabric-${Date.now()}.webp`;

    const fabricBuffer = Buffer.from(await fabric.arrayBuffer());
    await supabase.storage.from("ai-uploads").upload(sourcePath, fabricBuffer, {
      contentType: fabric.type,
      upsert: false,
    });

    const outputUrls: string[] = [];

    for (let index = 0; index < outputs.length; index += 1) {
      const bytes = Buffer.from(outputs[index].b64_json!, "base64");
      const outputPath = `sessions/${sessionId || "anonymous"}/design-${Date.now()}-${index + 1}.webp`;

      const upload = await supabase.storage.from("ai-designs").upload(outputPath, bytes, {
        contentType: "image/webp",
        upsert: false,
      });

      if (upload.error) continue;

      const { data } = supabase.storage.from("ai-designs").getPublicUrl(outputPath);
      if (data.publicUrl) outputUrls.push(data.publicUrl);
    }

    const { data: generation } = await supabase
      .from("ai_generations")
      .insert({
        customer_session_id: sessionId || null,
        source_storage_path: sourcePath,
        prompt_options: { dressType, sleeve, neckline, model },
        status: "completed",
        output_urls: outputUrls,
        provider: "openai-images-edit",
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return NextResponse.json({
      generationId: generation?.id ?? null,
      outputs: outputUrls,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate designs." },
      { status: 500 },
    );
  }
}
