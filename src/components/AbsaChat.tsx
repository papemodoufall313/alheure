"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content: "Bonjour ! Je suis ABSA, l'assistant d'À l'Heure. Posez-moi vos questions sur l'actualité du site : la Une du jour, les titres, le flash info… Je suis là pour vous aider.",
};

export default function AbsaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...history, assistantMsg]);

    try {
      const res = await fetch("/api/absa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur réseau");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Désolé, une erreur s'est produite. Veuillez réessayer." };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Fermer l'assistant ABSA" : "Ouvrir l'assistant ABSA"}
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--blue, #1a3a5c)", color: "#fff",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,.28)",
          transition: "transform .2s, box-shadow .2s",
          fontSize: 22,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, left: 24, zIndex: 998,
          width: 340, maxHeight: 500,
          background: "#fff", borderRadius: 10,
          boxShadow: "0 8px 40px rgba(0,0,0,.18)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--sans, system-ui)",
          overflow: "hidden",
          border: "1px solid var(--rule, #ddd)",
        }}>
          {/* Header */}
          <div style={{
            background: "var(--blue, #1a3a5c)", color: "#fff",
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ font: "700 14px var(--sans)", letterSpacing: ".02em" }}>ABSA</div>
              <div style={{ font: "400 11px var(--sans)", opacity: .75 }}>Assistant À l&apos;Heure</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "12px 14px",
            display: "flex", flexDirection: "column", gap: 10,
            background: "#f9f9f9",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "8px 12px",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "var(--blue, #1a3a5c)" : "#fff",
                  color: m.role === "user" ? "#fff" : "var(--ink, #111)",
                  font: "400 13px/1.5 var(--sans)",
                  boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.content}
                  {loading && i === messages.length - 1 && m.role === "assistant" && m.content === "" && (
                    <span style={{ opacity: .5 }}>…</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid var(--rule, #e5e5e5)",
            background: "#fff",
            display: "flex", gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Posez votre question…"
              disabled={loading}
              style={{
                flex: 1, padding: "8px 10px",
                border: "1px solid var(--rule, #ddd)", borderRadius: 6,
                font: "400 13px var(--sans)", color: "var(--ink, #111)",
                background: "#fff", outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: "8px 14px",
                background: loading || !input.trim() ? "var(--ink-3, #aaa)" : "var(--blue, #1a3a5c)",
                color: "#fff", border: "none", borderRadius: 6,
                font: "700 13px var(--sans)", cursor: loading || !input.trim() ? "default" : "pointer",
                transition: "background .15s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
