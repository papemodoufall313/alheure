import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import DeleteButton from "./DeleteButton";
import LogoutButton from "./LogoutButton";
import type { ArticleStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<ArticleStatus, { label: string; bg: string; color: string }> = {
  published: { label: "Publié",    bg: "#dcfce7", color: "#15803d" },
  draft:     { label: "Brouillon", bg: "#fef9c3", color: "#a16207" },
  scheduled: { label: "Planifié",  bg: "#dbeafe", color: "#1d4ed8" },
};

const BADGE_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  rep:        { label: "Grand reportage", bg: "#fee2e2", color: "#dc2626" },
  longformat: { label: "Long format",    bg: "#fef3c7", color: "#b45309" },
  video:      { label: "Vidéo",          bg: "#f3e8ff", color: "#7c3aed" },
  live:       { label: "Direct",         bg: "#fee2e2", color: "#dc2626" },
};

export default function AdminPage() {
  const articles = getAllArticles();

  const stats = {
    total: articles.length,
    published: articles.filter((a) => !a.status || a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    scheduled: articles.filter((a) => a.status === "scheduled").length,
    featured: articles.filter((a) => a.featured).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ font: "800 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>
              <span style={{ color: "#f0c8c5" }}>À</span> l&apos;Heure
            </span>
            <span style={{ font: "400 12px var(--sans)", color: "#a8b4cf", borderLeft: "1px solid #2a4a8c", paddingLeft: 20 }}>
              Administration
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/admin/auteurs" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>Auteurs</Link>
            <Link href="/admin/users" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>Comptes</Link>
            <Link href="/admin/podcasts" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>Podcasts</Link>
            <Link href="/admin/videos" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>Vidéos</Link>
            <Link href="/admin/wolof" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>Wolof</Link>
            <Link href="/admin/veille" style={{ font: "700 11px var(--sans)", color: "#86efac", textDecoration: "none" }}>📡 Veille</Link>
            <Link href="/admin/journal" style={{ font: "700 11px var(--sans)", color: "#fcd34d", textDecoration: "none" }}>📰 Journal</Link>
            <Link href="/admin/guide" style={{ font: "400 11px var(--sans)", color: "#fcd34d", textDecoration: "none" }}>📖 Guide</Link>
            <Link href="/" target="_blank" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Site</Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Articles total", value: stats.total, color: "var(--blue)", bg: "#eef3ff" },
            { label: "Publiés",        value: stats.published, color: "#15803d", bg: "#dcfce7" },
            { label: "Brouillons",     value: stats.draft,     color: "#a16207", bg: "#fef9c3" },
            { label: "Planifiés",      value: stats.scheduled, color: "#1d4ed8", bg: "#dbeafe" },
            { label: "En vedette",     value: stats.featured,  color: "var(--red)", bg: "#fee2e2" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.bg}`, borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ font: `700 28px var(--serif)`, fontStyle: "italic", color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ font: "500 11px var(--sans)", color: s.color, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h1 style={{ font: "700 22px var(--sans)", color: "var(--ink)", margin: 0 }}>Articles</h1>
            <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", margin: "4px 0 0" }}>{stats.total} article{stats.total > 1 ? "s" : ""}</p>
          </div>
          <Link href="/admin/nouveau" style={{ background: "var(--red)", color: "#fff", padding: "10px 22px", font: "700 13px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", borderRadius: 2 }}>
            + Nouvel article
          </Link>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #dde2ea", borderRadius: 4, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fb", borderBottom: "2px solid #dde2ea" }}>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left" }}>Titre</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 110 }}>Rubrique</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 130 }}>Auteur</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 100 }}>Statut</th>
                <th style={{ padding: "10px 16px", font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".08em", textTransform: "uppercase", textAlign: "left", width: 110 }}>Date</th>
                <th style={{ padding: "10px 16px", width: 130 }} />
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => {
                const statusKey: ArticleStatus = a.status ?? "published";
                const st = STATUS_STYLE[statusKey];
                return (
                  <tr key={a.slug} style={{ borderBottom: i < articles.length - 1 ? "1px solid #eef0f4" : "none" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ font: "600 13.5px var(--sans)", color: "var(--ink)", marginBottom: 2 }}>{a.title}</div>
                          <div style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>/article/{a.slug}</div>
                        </div>
                        {a.badge && BADGE_STYLE[a.badge] && (
                          <span style={{ background: BADGE_STYLE[a.badge].bg, color: BADGE_STYLE[a.badge].color, font: "600 10px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 2, alignSelf: "flex-start", flexShrink: 0 }}>
                            {BADGE_STYLE[a.badge].label}
                          </span>
                        )}
                        {a.featured && (
                          <span style={{ background: "#fff7ed", color: "#c2410c", font: "600 10px var(--sans)", letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 2, alignSelf: "flex-start", flexShrink: 0 }}>
                            ★ Vedette
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ font: "600 11px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--blue)", background: "#eef3ff", padding: "3px 8px", borderRadius: 2 }}>
                        {a.rubrique}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", font: "400 12.5px var(--sans)", color: "var(--ink-2)" }}>
                      {a.author}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: st.bg, color: st.color, font: "700 10.5px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2 }}>
                        {st.label}
                      </span>
                      {a.publishAt && statusKey === "scheduled" && (
                        <div style={{ font: "400 10px var(--sans)", color: "var(--ink-3)", marginTop: 3 }}>
                          {new Date(a.publishAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", font: "400 12.5px var(--sans)", color: "var(--ink-2)" }}>{a.date}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Link href={`/article/${a.slug}`} target="_blank" style={{ font: "400 11px var(--sans)", color: "var(--ink-2)", textDecoration: "none", padding: "4px 8px", border: "1px solid #dde2ea", borderRadius: 2 }}>
                          Voir
                        </Link>
                        <Link href={`/admin/${a.slug}`} style={{ font: "400 11px var(--sans)", color: "var(--blue)", textDecoration: "none", padding: "4px 8px", border: "1px solid var(--blue)", borderRadius: 2 }}>
                          Modifier
                        </Link>
                        <DeleteButton slug={a.slug} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
