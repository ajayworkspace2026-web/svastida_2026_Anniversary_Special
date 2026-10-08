import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type IncomingItem = {
  productId: string;
  quantity: number;
  size: string | null;
  measurements?: Record<string, string>;
  aiDesignUrl?: string | null;
};

type RequestBody = {
  customer: {
    name: string;
    phone: string;
    whatsappPhone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    customerNotes?: string;
  };
  items: IncomingItem[];
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Server database credentials are not configured.");

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validPhone(value: string) {
  return /^[0-9+()\-\s]{8,20}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const customer = body.customer;
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customer || !items.length || items.length > 30) {
      return NextResponse.json({ error: "Invalid order request." }, { status: 400 });
    }

    const required = [
      customer.name,
      customer.phone,
      customer.whatsappPhone,
      customer.addressLine1,
      customer.city,
      customer.state,
      customer.pincode,
    ];

    if (required.some((value) => !clean(value))) {
      return NextResponse.json({ error: "Please complete all required customer details." }, { status: 400 });
    }

    if (!validPhone(clean(customer.phone)) || !validPhone(clean(customer.whatsappPhone))) {
      return NextResponse.json({ error: "Please enter valid phone numbers." }, { status: 400 });
    }

    const normalized = items.map((item) => ({
      productId: clean(item.productId, 80),
      quantity: Number(item.quantity),
      size: item.size ? clean(item.size, 40) : null,
      measurements: item.measurements ?? {},
      aiDesignUrl: item.aiDesignUrl ? clean(item.aiDesignUrl, 1000) : null,
    }));

    if (normalized.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10)) {
      return NextResponse.json({ error: "One or more cart items are invalid." }, { status: 400 });
    }

    const supabase = getServiceClient();
    const productIds = [...new Set(
      normalized
        .filter((item) => !item.productId.startsWith("ai:"))
        .map((item) => item.productId),
    )];

    let products: Array<{
      id: string;
      slug: string;
      name: string;
      price: number;
      sale_price: number | null;
      status: string;
      sizes: string[];
    }> = [];

    if (productIds.length) {
      const { data, error: productError } = await supabase
        .from("products")
        .select("id,slug,name,price,sale_price,status,sizes")
        .in("id", productIds)
        .eq("status", "active");

      if (productError || !data || data.length !== productIds.length) {
        return NextResponse.json({ error: "One or more products are unavailable." }, { status: 409 });
      }

      products = data;
    }

    const byId = new Map(products.map((product) => [product.id, product]));

    const orderItems = normalized.map((item) => {
      const isAiDesign = item.productId.startsWith("ai:");
      if (isAiDesign) {
        const aiUrl = item.aiDesignUrl ?? "";
        const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
        if (!configuredUrl || !aiUrl.startsWith(`${configuredUrl}/storage/v1/object/public/ai-designs/`)) {
          throw new Error("The selected AI design is invalid.");
        }
        return {
          product_id: null,
          product_name: "Custom AI Design Enquiry",
          product_slug: "ai-custom-design",
          unit_price: 0,
          quantity: 1,
          size_label: item.size,
          measurements: item.measurements,
          ai_design_url: aiUrl,
        };
      }

      const product = byId.get(item.productId);
      if (!product) throw new Error("A selected product is no longer available.");
      const unitPrice = Number(product.sale_price ?? product.price);

      if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        if (!item.size) throw new Error(`Please select a size for ${product.name}.`);
        if (!product.sizes.includes(item.size)) throw new Error(`Size ${item.size} is unavailable for ${product.name}.`);
      }

      return {
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        unit_price: unitPrice,
        quantity: item.quantity,
        size_label: item.size,
        measurements: item.measurements,
        ai_design_url: item.aiDesignUrl,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    const { data: customerRow, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: clean(customer.name, 120),
        phone: clean(customer.phone, 30),
        whatsapp_phone: clean(customer.whatsappPhone, 30),
        email: clean(customer.email, 180) || null,
        address_line_1: clean(customer.addressLine1, 250),
        address_line_2: clean(customer.addressLine2, 250) || null,
        city: clean(customer.city, 100),
        state: clean(customer.state, 100),
        pincode: clean(customer.pincode, 20),
      })
      .select("id")
      .single();

    if (customerError || !customerRow) throw new Error("Could not save customer information.");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: "",
        customer_id: customerRow.id,
        customer_name: clean(customer.name, 120),
        phone: clean(customer.phone, 30),
        whatsapp_phone: clean(customer.whatsappPhone, 30),
        email: clean(customer.email, 180) || null,
        address_line_1: clean(customer.addressLine1, 250),
        address_line_2: clean(customer.addressLine2, 250) || null,
        city: clean(customer.city, 100),
        state: clean(customer.state, 100),
        pincode: clean(customer.pincode, 20),
        customer_notes: clean(customer.customerNotes, 1000) || null,
        subtotal,
        total: subtotal,
      })
      .select("id,order_number")
      .single();

    if (orderError || !order) {
      await supabase.from("customers").delete().eq("id", customerRow.id);
      throw new Error("Could not create your order.");
    }

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems.map((item) => ({ order_id: order.id, ...item })));

    if (itemError) {
      await supabase.from("orders").delete().eq("id", order.id);
      await supabase.from("customers").delete().eq("id", customerRow.id);
      throw new Error("Could not save order items.");
    }

    const { data: settings } = await supabase
      .from("site_settings")
      .select("whatsapp_admin_number,brand_name")
      .eq("id", true)
      .single();

    const whatsappNumber = String(
      settings?.whatsapp_admin_number ?? process.env.WHATSAPP_ADMIN_NUMBER ?? "",
    ).replace(/\D/g, "");
    const itemLines = orderItems.map((item, index) =>
      [
        `${index + 1}. ${item.product_name}`,
        `Size: ${item.size_label ?? "Custom"}`,
        `Quantity: ${item.quantity}`,
        item.unit_price > 0 ? `Unit price: ₹${item.unit_price}` : "Price: To be confirmed",
        Object.keys(item.measurements ?? {}).length
          ? `Measurements: ${JSON.stringify(item.measurements)}`
          : null,
        item.ai_design_url ? `AI design: ${item.ai_design_url}` : null,
      ].filter(Boolean).join("\n"),
    );

    const message = [
      `NEW ORDER REQUEST — ${settings?.brand_name ?? "Svastida"}`,
      "",
      `Order ID: ${order.order_number}`,
      "",
      "CUSTOMER",
      `Name: ${clean(customer.name, 120)}`,
      `Phone: ${clean(customer.phone, 30)}`,
      `WhatsApp: ${clean(customer.whatsappPhone, 30)}`,
      "",
      "DELIVERY",
      `Address: ${clean(customer.addressLine1, 250)}`,
      clean(customer.addressLine2, 250) ? `Landmark: ${clean(customer.addressLine2, 250)}` : null,
      `${clean(customer.city, 100)}, ${clean(customer.state, 100)} — ${clean(customer.pincode, 20)}`,
      "",
      "ITEMS",
      ...itemLines,
      "",
      `TOTAL: ₹${subtotal}`,
      clean(customer.customerNotes, 1000) ? `Customer note: ${clean(customer.customerNotes, 1000)}` : null,
      "",
      "Please contact the customer to confirm this order.",
    ].filter(Boolean).join("\n");

    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      : null;

    return NextResponse.json({
      orderNumber: order.order_number,
      whatsappUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to place the order." },
      { status: 500 },
    );
  }
}
