import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function clean(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AI_PROVIDER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Tailor AI is being connected. Please use the contact options for help right now." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { messages?: Message[] };
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const messages = incoming
      .filter((message) => message && (message.role === "user" || message.role === "assistant"))
      .map((message) => ({ role: message.role, content: clean(message.content) }))
      .filter((message) => message.content);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Ask Tailor a question first." }, { status: 400 });
    }

    const model = process.env.AI_CHAT_MODEL || "gpt-6-luna";
    const baseUrl = (process.env.AI_PROVIDER_BASE_URL || "https://api.openai.com").replace(/\/$/, "");
    const response = await fetch(baseUrl + "/v1/responses", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions:
          "You are Tailor, Svastida Fashion's warm and practical virtual fashion assistant. Help users choose silhouettes, fabrics, colours, occasions, and understand how to take garment measurements. Be concise, friendly, and transparent: recommendations are guidance, not a guarantee of fit. Never ask for or handle OTPs, passwords, UPI PINs, CVVs, card numbers, banking credentials, or remote device access. Do not invent store policies, prices, shipping promises, or contact details. When a question requires a final order decision, tell the user to contact Svastida. Svastida currently works enquiries through phone/WhatsApp and stays in touch with customers.",
        input: messages,
        max_output_tokens: 450,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Tailor is temporarily unavailable. Please try again." }, { status: 502 });
    }

    const result = (await response.json()) as { output_text?: string };
    const answer = clean(result.output_text, 2000);
    if (!answer) {
      return NextResponse.json({ error: "Tailor could not reply right now." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Tailor could not reply right now." }, { status: 500 });
  }
}