
"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/lib/types";

const styles = ["Anarkali", "Maxi Dress", "Gown", "Kurti", "Lehenga", "Party Dress"];
const sleeves = ["Sleeveless", "Short sleeve", "Long sleeve", "Statement sleeve"];
const necklines = ["Round", "V-neck", "Square", "Sweetheart", "High neck"];

export default function AIFashionDesigner({ aiConfigured = true }: { aiConfigured?: boolean }) {
  const { add } = useCart();
  const [fabric, setFabric] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [dressType, setDressType] = useState(styles[0]);
  const [sleeve, setSleeve] = useState(sleeves[1]);
  const [neckline, setNeckline] = useState(necklines[0]);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function chooseFabric(file: File | null) {
    setFabric(file);
    setError("");
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
  }

  async function generate() {
    if (!fabric) {
      setError("Upload a fabric image first.");
      return;
    }

    setError("");
    setNotice("");

    if (!aiConfigured) {
      setError("AI design generation is not configured yet. Please try again after the store administrator adds the AI provider key.");
      return;
    }

    setBusy(true);
    setSelected(null);

    try {
      let stableSessionId = sessionId;
      if (!stableSessionId) {
        stableSessionId = window.localStorage.getItem("svastida-ai-session") || crypto.randomUUID();
        window.localStorage.setItem("svastida-ai-session", stableSessionId);
        setSessionId(stableSessionId);
      }

      const form = new FormData();
      form.append("fabric", fabric);
      form.append("dressType", dressType);
      form.append("sleeve", sleeve);
      form.append("neckline", neckline);
      form.append("sessionId", stableSessionId);

      const response = await fetch("/api/ai/design", { method: "POST", body: form });
      const result = (await response.json()) as {
        generationId?: string | null;
        outputs?: string[];
        error?: string;
      };

      if (!response.ok || !result.outputs?.length) {
        throw new Error(result.error ?? "No designs were generated.");
      }

      setGenerationId(result.generationId ?? null);
      setOutputs(result.outputs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate designs.");
    } finally {
      setBusy(false);
    }
  }

  function addSelectedToEnquiry() {
    if (selected === null || !outputs[selected]) {
      setError("Choose a design first.");
      return;
    }

    const item: CartItem = {
      productId: `ai:${generationId ?? "custom"}:${selected}`,
      slug: "ai-custom-design",
      name: `Custom AI Design — ${dressType}`,
      unitPrice: 0,
      quantity: 1,
      size: null,
      measurements: {},
      imageUrl: outputs[selected],
      aiDesignUrl: outputs[selected],
    };

    add(item);
    setNotice("Design added to your enquiry cart. You can submit it with your customer details.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <label className="block text-sm font-medium">
          Fabric image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => chooseFabric(event.target.files?.[0] ?? null)}
            className="mt-3 block w-full rounded-xl border border-dashed border-black/20 p-5 text-sm"
          />
        </label>

        {preview ? (
          <img src={preview} alt="Fabric preview" className="mt-5 aspect-square w-full rounded-xl object-cover" />
        ) : (
          <div className="mt-5 grid aspect-square place-items-center rounded-xl bg-[#f7f5f0] text-sm text-black/35">
            Upload a clear fabric photograph.
          </div>
        )}

        <div className="mt-6 grid gap-4">
          <label className="text-sm">
            Dress type
            <select value={dressType} onChange={(event) => setDressType(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3">
              {styles.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label className="text-sm">
            Sleeve
            <select value={sleeve} onChange={(event) => setSleeve(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3">
              {sleeves.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label className="text-sm">
            Neckline
            <select value={neckline} onChange={(event) => setNeckline(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3">
              {necklines.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>

        {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {notice ? <p className="mt-5 rounded-xl bg-[#f7f5f0] px-4 py-3 text-sm">{notice}</p> : null}

        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Creating your designs..." : "Generate 4 design concepts"}
        </button>
        <p className="mt-3 text-xs leading-5 text-black/40">
          AI output is a visual concept. It is not an exact sewing pattern or fit guarantee.
        </p>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold)]">Concept board</p>
            <h2 className="mt-2 text-4xl">Explore the possibilities.</h2>
          </div>
          {selected !== null ? <span className="text-xs text-black/45">Design {selected + 1} selected</span> : null}
        </div>

        {outputs.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {outputs.map((url, index) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setSelected(index)}
                  className={`group overflow-hidden text-left ${selected === index ? "ring-2 ring-[var(--gold-bright)]" : "ring-1 ring-black/10"}`}
                >
                  <img src={url} alt={`AI dress concept ${index + 1}`} className="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
                  <div className="bg-white px-4 py-3 text-sm">Concept {index + 1}</div>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={selected === null}
              onClick={addSelectedToEnquiry}
              className="mt-6 rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add selected design to enquiry
            </button>
          </>
        ) : (
          <div className="grid min-h-[600px] place-items-center rounded-2xl border border-dashed border-black/15 bg-[#f7f5f0] p-10 text-center">
            <div>
              <p className="display-font text-4xl">Your concepts will appear here.</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/45">
                Upload your fabric, choose a direction, and generate a small concept board for discussion with the brand.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
