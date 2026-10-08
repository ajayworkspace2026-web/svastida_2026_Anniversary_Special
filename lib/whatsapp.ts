export type WhatsAppOrderItem = {
  productName: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  measurements: Record<string, string>;
  aiDesignUrl: string | null;
};

export function normalizeWhatsAppNumber(value: string | null | undefined) {
  return String(value ?? "").replace(/\D/g, "");
}

export function buildOrderMessage({
  brandName,
  orderNumber,
  customer,
  items,
  total,
}: {
  brandName: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    whatsappPhone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    customerNotes?: string;
  };
  items: WhatsAppOrderItem[];
  total: number;
}) {
  const itemLines = items.map((item, index) =>
    [
      `${index + 1}. ${item.productName}`,
      `Size: ${item.size ?? "Custom"}`,
      `Quantity: ${item.quantity}`,
      item.unitPrice > 0 ? `Unit price: ₹${item.unitPrice}` : "Price: To be confirmed",
      Object.keys(item.measurements ?? {}).length
        ? `Measurements: ${JSON.stringify(item.measurements)}`
        : null,
      item.aiDesignUrl ? `AI design: ${item.aiDesignUrl}` : null,
    ].filter(Boolean).join("\n"),
  );

  return [
    `NEW ORDER REQUEST — ${brandName}`,
    "",
    `Order ID: ${orderNumber}`,
    "",
    "CUSTOMER",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `WhatsApp: ${customer.whatsappPhone}`,
    "",
    "DELIVERY",
    `Address: ${customer.addressLine1}`,
    customer.addressLine2 ? `Landmark: ${customer.addressLine2}` : null,
    `${customer.city}, ${customer.state} — ${customer.pincode}`,
    "",
    "ITEMS",
    ...itemLines,
    "",
    `TOTAL: ₹${total}`,
    customer.customerNotes ? `Customer note: ${customer.customerNotes}` : null,
    "",
    "Please contact the customer to confirm this order.",
  ].filter(Boolean).join("\n");
}

export function buildClickToChatUrl(adminNumber: string | null | undefined, message: string) {
  const number = normalizeWhatsAppNumber(adminNumber);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

type WhatsAppApiResult = {
  sent: boolean;
  messageId?: string;
  error?: string;
};

export async function sendWhatsAppCloudText(
  recipient: string,
  message: string,
): Promise<WhatsAppApiResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_GRAPH_API_VERSION;

  if (!accessToken || !phoneNumberId || !version) {
    return { sent: false, error: "WhatsApp Cloud API is not configured." };
  }

  const endpoint = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizeWhatsAppNumber(recipient),
      type: "text",
      text: {
        preview_url: false,
        body: message.slice(0, 4096),
      },
    }),
  });

  if (!response.ok) {
    return { sent: false, error: "WhatsApp Cloud API rejected the message." };
  }

  const result = (await response.json()) as {
    messages?: Array<{ id?: string }>;
  };

  return {
    sent: true,
    messageId: result.messages?.[0]?.id,
  };
}
