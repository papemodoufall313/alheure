import Link from "next/link";
import ArticleForm from "../ArticleForm";

export default function NouvelArticlePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ font: "800 16px var(--serif)", fontStyle: "italic" }}>
              <span style={{ color: "#f0c8c5" }}>À</span> l&apos;Heure
            </span>
            <span style={{ font: "400 12px var(--sans)", color: "#a8b4cf", borderLeft: "1px solid #2a4a8c", paddingLeft: 20 }}>Administration</span>
          </div>
          <Link href="/admin" style={{ font: "400 12px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Retour</Link>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px" }}>
        <h1 style={{ font: "700 22px var(--sans)", color: "var(--ink)", margin: "0 0 28px" }}>Nouvel article</h1>
        <div style={{ background: "#fff", border: "1px solid #dde2ea", borderRadius: 4, padding: 28 }}>
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
