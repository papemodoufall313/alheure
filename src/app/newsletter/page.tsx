import Link from "next/link";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const WA_BASE = "https://wa.me/221761652210?text=";

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.542 5.874L.057 23.887a.5.5 0 0 0 .608.61l6.174-1.617A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 0 1-5.031-1.374l-.36-.214-3.733.979.998-3.648-.236-.374A9.865 9.865 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z"/>
  </svg>
);

const NEWSLETTERS = [
  {
    name: "Le Brief de Dakar",
    freq: "Du lundi au vendredi · 7h00",
    desc: "L'essentiel de l'actualité sénégalaise et africaine en 5 minutes. Les titres, un décryptage, une citation du jour.",
    color: "var(--blue)",
    icon: "☀️",
    msg: encodeURIComponent("Bonjour, je souhaite m'abonner au Brief de Dakar (newsletter quotidienne d'À l'Heure)."),
  },
  {
    name: "L'Hebdo du Week-end",
    freq: "Chaque samedi · 9h00",
    desc: "Grand format, analyses approfondies, et la sélection culturelle de la semaine. Pour prendre le temps de lire.",
    color: "#2a6e3e",
    icon: "📰",
    msg: encodeURIComponent("Bonjour, je souhaite m'abonner à L'Hebdo du Week-end d'À l'Heure."),
  },
  {
    name: "Afrique en marche",
    freq: "Chaque mercredi · 12h00",
    desc: "Le tour du continent en une newsletter : politique, économie, culture et société des 54 pays africains.",
    color: "#b5451b",
    icon: "🌍",
    msg: encodeURIComponent("Bonjour, je souhaite m'abonner à Afrique en marche d'À l'Heure."),
  },
  {
    name: "Sport & Arène",
    freq: "Chaque vendredi soir",
    desc: "Football, lutte sénégalaise, basket, athlétisme — les résultats et les coulisses du sport sénégalais et africain.",
    color: "#1a5f8a",
    icon: "⚽",
    msg: encodeURIComponent("Bonjour, je souhaite m'abonner à Sport & Arène d'À l'Heure."),
  },
];

export default function NewsletterPage() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div style={{ background: "#25D366", padding: "52px 0 44px" }}>
          <div className="wrap" style={{ textAlign: "center" }}>
            <span style={{ font: "700 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>À l&apos;Heure · Newsletter</span>
            <h1 style={{ font: "800 42px var(--serif)", color: "#fff", margin: "8px 0 16px" }}>Nos newsletters WhatsApp</h1>
            <p style={{ font: "400 17px var(--sans)", color: "rgba(255,255,255,.88)", maxWidth: 520, margin: "0 auto 28px" }}>
              Recevez l&apos;actualité sénégalaise directement sur WhatsApp. Gratuit, sans publicité.
            </p>
            <Link
              href={`${WA_BASE}${encodeURIComponent("Bonjour, je souhaite m'abonner aux newsletters d'À l'Heure.")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#128C7E", padding: "13px 28px", borderRadius: 4, font: "700 15px var(--sans)", textDecoration: "none", letterSpacing: ".03em" }}
            >
              {WA_ICON}
              S&apos;abonner via WhatsApp · 76 165 22 10
            </Link>
          </div>
        </div>

        <div className="wrap" style={{ padding: "48px 28px 80px" }}>
          <h2 style={{ font: "700 13px var(--sans)", color: "var(--ink-2)", marginBottom: 28, textTransform: "uppercase", letterSpacing: ".1em" }}>
            Choisissez votre newsletter
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {NEWSLETTERS.map((nl) => (
              <div key={nl.name} style={{ border: "1px solid var(--rule)", borderRadius: 6, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{nl.icon}</span>
                  <div>
                    <div style={{ font: "700 17px var(--serif)", color: "var(--ink)" }}>{nl.name}</div>
                    <div style={{ font: "600 11px var(--sans)", color: nl.color, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 3 }}>{nl.freq}</div>
                  </div>
                </div>
                <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{nl.desc}</p>
                <Link
                  href={`${WA_BASE}${nl.msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="waBtn"
                  style={{ marginTop: "auto" }}
                >
                  {WA_ICON}
                  S&apos;abonner sur WhatsApp
                </Link>
              </div>
            ))}
          </div>
          <p style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", marginTop: 32, textAlign: "center" }}>
            Gratuit · Désabonnement à tout moment · Pas de spam
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
