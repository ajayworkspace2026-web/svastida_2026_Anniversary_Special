"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starter: Message[] = [
  {
    role: "assistant",
    content:
      "Hi, I’m Tailor 👋 I can help you choose a style, understand measurements, and pick the right fabric direction for your look.",
  },
];

export default function TailorAssistant({ aiConfigured = true }: { aiConfigured?: boolean }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(starter);
  const [busy, setBusy] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");

    if (!aiConfigured) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I’m ready to help, but my AI service is still being connected. For now, you can ask the Svastida team on WhatsApp or email about measurements and fabric selection.",
        },
      ]);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-12),
        }),
      });

      const result = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !result.answer) {
        throw new Error(result.error ?? "Tailor could not reply right now.");
      }

      setMessages([...next, { role: "assistant", content: result.answer }]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Tailor could not reply right now.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close Tailor assistant" : "Open Tailor assistant"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5"
      >
        <span className="grid size-7 place-items-center rounded-full bg-[var(--gold-bright)] text-black">T</span>
        Tailor
      </button>

      {open ? (
        <aside
          aria-label="Tailor fashion assistant"
          className="fixed bottom-20 right-5 z-50 flex w-[min(92vw,390px)] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl"
        >
          <div className="border-b border-black/10 bg-black px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-bright)]">Svastida assistant</p>
                <h2 className="mt-1 text-2xl">Tailor</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full border border-white/20 text-lg" aria-label="Close Tailor">
                ×
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/60">
              Ask about measurements, fabric selection, silhouettes, or what might suit your occasion.
            </p>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.role === "user" ? "ml-8 rounded-2xl bg-black px-4 py-3 text-sm text-white" : "mr-8 rounded-2xl bg-[#f7f5f0] px-4 py-3 text-sm leading-6"}
              >
                {message.content}
              </div>
            ))}
            {busy ? <div className="mr-8 rounded-2xl bg-[#f7f5f0] px-4 py-3 text-sm text-black/45">Tailor is thinking…</div> : null}
          </div>

          <form
            className="border-t border-black/10 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={1000}
                placeholder="Ask Tailor anything…"
                className="min-w-0 flex-1 rounded-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </form>
        </aside>
      ) : null}
    </>
  );
}
