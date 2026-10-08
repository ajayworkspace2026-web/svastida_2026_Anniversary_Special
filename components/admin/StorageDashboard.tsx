"use client";

import { useEffect, useState } from "react";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 2 : 0)} ${units[index]}`;
}

type StorageResponse = {
  totalBytes: number;
  fileCount: number;
  limitBytes: number;
  percentage: number | null;
  measuredAt: string;
  breakdown: Record<string, number>;
};

export default function StorageDashboard() {
  const [data, setData] = useState<StorageResponse | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const response = await fetch("/api/admin/storage", { cache: "no-store" });
    const result = (await response.json()) as StorageResponse & { error?: string };
    if (!response.ok) {
      setError(result.error ?? "Could not load storage.");
      return;
    }
    setData(result);
  }

  useEffect(() => { void load(); }, []);

  if (error) return <div role="alert" className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  if (!data) return <div className="rounded-2xl bg-white p-6 text-sm text-black/40">Measuring storage...</div>;

  return (
    <section className="rounded-2xl bg-white p-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Storage</p>
          <h2 className="mt-2 text-4xl">{formatBytes(data.totalBytes)} used</h2>
        </div>
        <p className="text-sm text-black/40">{data.fileCount} files · measured {new Date(data.measuredAt).toLocaleString("en-IN")}</p>
      </div>

      <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[var(--gold-bright)] transition-all"
          style={{ width: `${data.percentage ?? 0}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-black/45">
        <span>{data.percentage === null ? "Limit not configured" : `${data.percentage.toFixed(1)}% used`}</span>
        <span>{data.limitBytes ? `Configured limit: ${formatBytes(data.limitBytes)}` : "No configured limit"}</span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {Object.entries(data.breakdown).map(([key, bytes]) => (
          <div key={key} className="rounded-xl bg-[#f7f5f0] p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-black/35">{key.replaceAll("_bytes", "").replaceAll("_", " ")}</p>
            <p className="mt-2 text-xl">{formatBytes(bytes)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
