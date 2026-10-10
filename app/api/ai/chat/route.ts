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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Tailor AI is not configured yet. Please use the contact options for help right now." },
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

    const model = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) +
      ":generateContent";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text:
              "You are Tailor, Svastida Fashion's virtual fashion assistant. " +
              "Your job is to help website visitors with Svastida website navigation, products and collections when information is provided in the conversation, clothing styles, outfit selection, fabrics, colours, occasions, fit, and garment measurements. " +
              "For measurements, explain practical ways to measure bust, waist, hips, shoulder, sleeve length, garment length, and similar dimensions using a soft measuring tape. Explain that measurements should be taken over light clothing, tape should be snug rather than tight, and the person should stand naturally. Never promise an exact fit from measurements alone. " +
              "Do not invent Svastida products, prices, stock, shipping timelines, policies, phone numbers, WhatsApp numbers, addresses, discounts, or order status. When the answer depends on current store data that you do not have, tell the customer to contact Svastida. " +
              "Keep replies friendly, practical, and concise. You may politely decline questions that are unrelated to Svastida, fashion, clothing, fit, measurements, or website help. " +
              "Never ask for or handle passwords, OTPs, UPI PINs, card numbers, CVVs, banking credentials, or remote device access.",
          }],
        },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 450,
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Tailor is temporarily unavailable. Please try again." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const answer = clean(
      result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? "",
      2000,
    );

    if (!answer) {
      return NextResponse.json({ error: "Tailor could not reply right now." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Tailor could not reply right now." }, { status: 500 });
  }
}