import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const articles = getAllArticles();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ font: "800 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>
              <span style={{ color: "#f0c8c5" }}>À</span> l&apos;Heure
            </span>
            <span style={{ font: "400 12px var(--sans)", color: "#a8b4cf", borderLeft: "1px solid #2a4a8c", paddingLeft: 20 }}>
              Administration
            </span>
          </div>
          <Link href="/" target="_blank" style={{ font: "400 12px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>
            ← Voir le site
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ font: "700 22px var(--sans)", color: "var(--ink)", margin: 0 }}>Articles</h1>
            <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", margin: "4px 0 0" }}>{articles.length} article{articles.length > 1 ? "s" : ""}</p>
          </div>
          <Link href="/admin/nouveau" style={{ background: "var(--red)", color: "#fff", padding: "10px 22px", font: "700 13px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
            + Nouvel article
          </Link>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #dde2ea", borderRadius: 4, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fb", borderBottom: "2px solid #dde2ea" }}>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left" }}>Titre</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 120 }}>Rubrique</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 140 }}>Auteur</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 120 }}>Date</th>
                <th style={{ padding: "10px 16px", width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a.slug} style={{ borderBottom: i < articles.length - 1 ? "1px solid #eef0f4" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ font: "600 14px var(--sans)", color: "var(--ink)", marginBottom: 2 }}>{a.title}</div>
                    <div style={{ font: "400 12px var(--sans)", color: "var(--ink-3)" }}>/article/{a.slug}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ font: "600 11px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--blue)", background: "#eef3ff", padding: "3px 8px", borderRadius: 2 }}>
                      {a.rubrique}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", font: "400 13px var(--sans)", color: "var(--ink-2)" }}>{a.author}</td>
                  <td style={{ padding: "12px 16px", font: "400 13px var(--sans)", color: "var(--ink-2)" }}>{a.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <Link href={`/article/${a.slug}`} target="_blank" style={{ font: "400 12px var(--sans)", color: "var(--ink-2)", textDecoration: "none", padding: "4px 10px", border: "1px solid #dde2ea", borderRadius: 2 }}>
                        Voir
                      </Link>
                      <Link href={`/admin/${a.slug}`} style={{ font: "400 12px var(--sans)", color: "var(--blue)", textDecoration: "none", padding: "4px 10px", border: "1px solid var(--blue)", borderRadius: 2 }}>
                        Modifier
                      </Link>
                      <DeleteButton slug={a.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
