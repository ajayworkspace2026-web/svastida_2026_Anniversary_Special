"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";

export default function OrderStatusSelect({
  id,
  value,
}: {
  id: string;
  value: OrderStatus;
}) {
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function change(next: OrderStatus) {
    setSaving(true);
    setStatus(next);
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", id);
    if (error) setStatus(value);
    setSaving(false);
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(event) => change(event.target.value as OrderStatus)}
      className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs"
    >
      {["new","contacted","confirmed","preparing","ready","delivered","cancelled"].map((item) => (
        <option key={item} value={item}>{item.replace("_", " ")}</option>
      ))}
    </select>
  );
}
