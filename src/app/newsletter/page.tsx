"use client";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const NEWSLETTERS = [
  {
    id: "brief",
    name: "Le Brief de Dakar",
    freq: "Du lundi au vendredi · 7h00",
    desc: "L'essentiel de l'actualité sénégalaise et africaine en 5 minutes. Les titres, un décryptage, une citation du jour.",
    color: "var(--blue)",
    icon: "☀️",
    subscribers: "12 400",
  },
  {
    id: "weekend",
    name: "L'Hebdo du Week-end",
    freq: "Chaque samedi · 9h00",
    desc: "Grand format, analyses approfondies, et la sélection culturelle de la semaine. Pour prendre le temps de lire.",
    color: "#2a6e3e",
    icon: "📰",
    subscribers: "7 800",
  },
  {
    id: "afrique",
    name: "Afrique en marche",
    freq: "Chaque mercredi · 12h00",
    desc: "Le tour du continent en une newsletter : politique, économie, culture et société des 54 pays africains.",
    color: "#b5451b",
    icon: "🌍",
    subscribers: "5 200",
  },
  {
    id: "sport",
    name: "Sport & Arène",
    freq: "Chaque vendredi soir",
    desc: "Football, lutte sénégalaise, basket, athlétisme — les résultats et les coulisses du sport sénégalais et africain.",
    color: "#1a5f8a",
    icon: "⚽",
    subscribers: "9 100",
  },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["brief"]);
  const [done, setDone] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && selected.length > 0) setDone(true);
  }

  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div style={{ background: "var(--blue)", padding: "52px 0 44px" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <span style={{ font: "700 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.65)" }}>À l'Heure</span>
            <h1 style={{ font: "800 42px var(--serif)", color: "#fff", margin: "8px 0 16px" }}>Nos newsletters</h1>
            <p style={{ font: "400 17px var(--sans)", color: "rgba(255,255,255,.8)", maxWidth: 520, margin: "0 auto" }}>
              Choisissez vos newsletters et recevez l'actualité directement dans votre boîte mail.
            </p>
          </div>
        </div>

        <div className="wrap" style={{ padding: "48px 28px 80px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ font: "700 28px var(--serif)", color: "var(--ink)", marginBottom: 8 }}>Inscription confirmée !</h2>
              <p style={{ font: "400 16px var(--sans)", color: "var(--ink-2)" }}>
                Vous recevrez bientôt vos premières newsletters à <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 60, alignItems: "start" }}>
              <div>
                <h2 style={{ font: "700 20px var(--sans)", color: "var(--ink)", marginBottom: 24, textTransform: "uppercase", letterSpacing: ".08em", fontSize: 13 }}>
                  Choisissez vos newsletters
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {NEWSLETTERS.map((nl) => (
                    <label key={nl.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "start", padding: 20, border: `2px solid ${selected.includes(nl.id) ? nl.color : "var(--rule)"}`, borderRadius: 6, cursor: "pointer", transition: "border-color .2s", background: selected.includes(nl.id) ? `${nl.color}08` : "transparent" }}>
                      <span style={{ fontSize: 28, lineHeight: 1 }}>{nl.icon}</span>
                      <div>
                        <div style={{ font: "700 17px var(--serif)", color: "var(--ink)", marginBottom: 4 }}>{nl.name}</div>
                        <div style={{ font: "600 11px var(--sans)", color: nl.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{nl.freq}</div>
                        <div style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", lineHeight: 1.5 }}>{nl.desc}</div>
                        <div style={{ font: "500 11px var(--sans)", color: "var(--ink-3)", marginTop: 6 }}>{nl.subscribers} abonnés</div>
                      </div>
                      <input type="checkbox" checked={selected.includes(nl.id)} onChange={() => toggle(nl.id)} style={{ width: 18, height: 18, accentColor: nl.color, marginTop: 2 }} />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ position: "sticky", top: 90 }}>
                <div style={{ background: "var(--paper-alt, #f5f3ee)", border: "1px solid var(--rule)", borderRadius: 6, padding: 28 }}>
                  <h3 style={{ font: "700 18px var(--serif)", color: "var(--ink)", marginBottom: 6 }}>S'abonner</h3>
                  <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", marginBottom: 20, lineHeight: 1.5 }}>
                    {selected.length === 0 ? "Sélectionnez au moins une newsletter." : `${selected.length} newsletter${selected.length > 1 ? "s" : ""} sélectionnée${selected.length > 1 ? "s" : ""}.`}
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      style={{ padding: "12px 14px", border: "2px solid var(--rule)", borderRadius: 4, font: "400 15px var(--sans)", color: "var(--ink)", background: "#fff", outline: "none" }}
                    />
                    <button
                      type="submit"
                      disabled={selected.length === 0}
                      style={{ background: selected.length > 0 ? "var(--blue)" : "var(--ink-3)", color: "#fff", border: "none", borderRadius: 4, padding: "13px", font: "700 14px var(--sans)", cursor: selected.length > 0 ? "pointer" : "not-allowed", transition: "background .2s" }}
                    >
                      S'abonner gratuitement
                    </button>
                  </form>
                  <p style={{ font: "400 11px var(--sans)", color: "var(--ink-3)", marginTop: 12, lineHeight: 1.4 }}>
                    Gratuit · Sans publicité · Désabonnement en un clic
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
