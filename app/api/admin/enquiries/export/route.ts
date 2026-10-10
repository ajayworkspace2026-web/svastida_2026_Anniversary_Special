import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csv(value: unknown) {
  const text = value == null ? "" : String(value);
  return '"' + text.replace(/"/g, '""').replace(/\r?\n/g, " ") + '"';
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: enquiries, error } = await supabase
      .from("orders")
      .select("order_number,created_at,customer_name,phone,whatsapp_phone,email,address_line_1,address_line_2,city,state,pincode,customer_notes,total,status,order_items(product_name,quantity,size_label,unit_price,ai_design_url)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = [
      [
        "Enquiry ID",
        "Created At",
        "Customer Name",
        "Phone",
        "WhatsApp",
        "Email",
        "Address",
        "Landmark",
        "City",
        "State",
        "Pincode",
        "Notes",
        "Items",
        "Total",
        "Status",
      ].map(csv).join(","),
    ];

    for (const enquiry of enquiries ?? []) {
      const items = ((enquiry.order_items ?? []) as Array<Record<string, unknown>>).map((item) =>
        [
          item.product_name ?? "",
          "Size: " + (item.size_label ?? "Custom"),
          "Qty: " + (item.quantity ?? 1),
          "Unit: " + (item.unit_price ?? 0),
          item.ai_design_url ? "AI design attached" : "",
        ].filter(Boolean).join(" | "),
      ).join("; ");

      rows.push([
        enquiry.order_number,
        enquiry.created_at,
        enquiry.customer_name,
        enquiry.phone,
        enquiry.whatsapp_phone,
        enquiry.email,
        enquiry.address_line_1,
        enquiry.address_line_2,
        enquiry.city,
        enquiry.state,
        enquiry.pincode,
        enquiry.customer_notes,
        items,
        enquiry.total,
        enquiry.status,
      ].map(csv).join(","));
    }

    return new Response(rows.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="svastida-enquiries.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not export enquiries." }, { status: 500 });
  }
}
