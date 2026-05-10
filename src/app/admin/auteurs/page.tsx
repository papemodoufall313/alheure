import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { KNOWN_AUTHORS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function AuteursPage() {
  const articles = getAllArticles();

  const authorStats = KNOWN_AUTHORS.map((a) => ({
    ...a,
    count: articles.filter((art) => art.author === a.name || art.author.startsWith(a.name)).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ font: "800 16px var(--serif)", fontStyle: "italic" }}>
              <span style={{ color: "#f0c8c5" }}>À</span> l&apos;Heure
            </span>
            <span style={{ font: "400 12px var(--sans)", color: "#a8b4cf", borderLeft: "1px solid #2a4a8c", paddingLeft: 20 }}>
              Administration · Auteurs
            </span>
          </div>
          <Link href="/admin" style={{ font: "400 12px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>
            ← Retour aux articles
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ font: "700 22px var(--sans)", color: "var(--ink)", margin: 0 }}>Auteurs</h1>
          <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", margin: "4px 0 0" }}>{KNOWN_AUTHORS.length} auteurs enregistrés</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {authorStats.map((a) => (
            <div key={a.name} style={{ background: "#fff", border: "1px solid #dde2ea", borderRadius: 6, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "var(--blue)" }}>
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 14px var(--sans)", color: "var(--ink)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                {a.rubrique && (
                  <span style={{ font: "600 10px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--blue)", background: "#eef3ff", padding: "2px 6px", borderRadius: 2, display: "inline-block", marginBottom: 6 }}>
                    {a.rubrique}
                  </span>
                )}
                <div style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", lineHeight: 1.45, marginBottom: 8 }}>{a.bio}</div>
                <div style={{ font: "600 11px var(--sans)", color: a.count > 0 ? "var(--blue)" : "var(--ink-4)" }}>
                  {a.count} article{a.count !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
