"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface FeedItem {
  id: string; title: string; excerpt: string;
  url: string; source: string; category: string;
  date: string; imgUrl?: string;
}

const RUBRIQUES = [
  { value: "senegal",   label: "Sénégal"   },
  { value: "afrique",   label: "Afrique"   },
  { value: "monde",     label: "Monde"     },
  { value: "politique", label: "Politique" },
  { value: "economie",  label: "Économie"  },
  { value: "societe",   label: "Société"   },
  { value: "sport",     label: "Sport"     },
  { value: "culture",   label: "Culture"   },
  { value: "diaspora",  label: "Diaspora"  },
];

const CAT_COLORS: Record<string, string> = {
  senegal:"#0e2b62", afrique:"#b45309", economie:"#15803d",
  monde:"#374151", sport:"#dc2626", culture:"#7c3aed",
};

const EMPTY_DRAFT = { title: "", dek: "", body: "", rubrique: "senegal", author: "", imgUrl: "" };

export default function AdminVeille() {
  const [items,   setItems]   = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const [draft,   setDraft]   = useState({ ...EMPTY_DRAFT });
  const [rewriting, setRewriting] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ text: "", error: false });
  const [lastFetch, setLastFetch] = useState(0);
  const [tab,     setTab]     = useState<"veille"|"draft">("veille");
  const [uploading, setUploading] = useState(false);

  function flash(text: string, error = false) {
    setMsg({ text, error });
    setTimeout(() => setMsg({ text: "", error: false }), 4000);
  }

  const fetchFeeds = useCallback(async (force = false) => {
    setLoading(true);
    const res  = await fetch(`/api/admin/veille${force ? "?refresh=1" : ""}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLastFetch(data.ts ?? Date.now());
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeeds(); }, [fetchFeeds]);

  function selectItem(item: FeedItem) {
    setSelected(item);
    setDraft({ ...EMPTY_DRAFT, title: item.title, dek: item.excerpt.slice(0, 180), rubrique: item.category });
    setTab("draft");
  }

  async function rewrite() {
    if (!selected) return;
    setRewriting(true);
    const res  = await fetch("/api/admin/veille/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: selected.title, excerpt: selected.excerpt, url: selected.url, rubrique: draft.rubrique }),
    });
    const data = await res.json();
    setRewriting(false);
    if (data.error) { flash(data.error, true); return; }
    setDraft(d => ({ ...d, title: data.title || d.title, dek: data.dek || d.dek, body: data.body || "" }));
    flash("Article réécrit par l'IA ✓");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res  = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (data.error) { flash(data.error, true); return; }
    setDraft(d => ({ ...d, imgUrl: data.url }));
    flash("Image téléversée ✓");
  }

  async function saveDraft(status: "draft" | "published") {
    if (!draft.title || !draft.rubrique) { flash("Titre et rubrique obligatoires.", true); return; }
    if (status === "published" && !draft.imgUrl) { flash("Ajoutez une image avant de publier.", true); return; }
    setSaving(true);
    const res  = await fetch("/api/admin/veille/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, status }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.error) { flash(data.error, true); return; }
    flash(status === "published" ? "Article publié ✓" : "Brouillon sauvegardé ✓");
    setDraft({ ...EMPTY_DRAFT });
    setSelected(null);
    setTab("veille");
  }

  const filtered = items.filter(it => {
    const matchCat = filter === "all" || it.category === filter;
    const matchQ   = !search || it.title.toLowerCase().includes(search.toLowerCase()) ||
                     it.source.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const sources = [...new Set(items.map(i => i.source))].sort();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", padding: "0 28px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/admin" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Admin</Link>
            <span style={{ font: "700 15px var(--serif)", fontStyle: "italic", color: "#fff" }}>Veille & Rédaction</span>
            <span style={{ font: "400 11px var(--sans)", color: "#6070a0" }}>
              {items.length} articles · {sources.length} sources
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {msg.text && <span style={{ font: "600 12px var(--sans)", color: msg.error ? "#fca5a5" : "#86efac" }}>{msg.text}</span>}
            <button onClick={() => fetchFeeds(true)} disabled={loading}
              style={{ background: "none", border: "1px solid #3a5080", borderRadius: 4, padding: "5px 12px", font: "600 11px var(--sans)", color: "#a8b4cf", cursor: "pointer" }}>
              {loading ? "Chargement…" : "↻ Rafraîchir"}
            </button>
            <Link href="/admin/journal" style={{ background: "var(--red)", color: "#fff", padding: "5px 14px", font: "700 11px var(--sans)", textDecoration: "none", borderRadius: 4 }}>
              📰 Générer le journal
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 0, minHeight: "calc(100vh - 54px)" }}>

        {/* ── Colonne gauche : flux RSS ─────────────────────────────────── */}
        <div style={{ borderRight: "1px solid #dde2ea", display: "flex", flexDirection: "column" }}>
          {/* Filtres */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #dde2ea", background: "#fff", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: "6px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 12px var(--sans)", width: 180 }}
            />
            {[{ value: "all", label: "Tous" }, ...RUBRIQUES].map(r => (
              <button key={r.value} onClick={() => setFilter(r.value)}
                style={{ padding: "5px 12px", borderRadius: 20, font: "600 11px var(--sans)", cursor: "pointer", border: "1.5px solid", letterSpacing: ".04em",
                  background: filter === r.value ? (CAT_COLORS[r.value] ?? "var(--blue)") : "#fff",
                  color: filter === r.value ? "#fff" : "var(--ink-2)",
                  borderColor: filter === r.value ? (CAT_COLORS[r.value] ?? "var(--blue)") : "#dde2ea" }}>
                {r.label}
              </button>
            ))}
            {lastFetch > 0 && (
              <span style={{ font: "400 10px var(--sans)", color: "var(--ink-3)", marginLeft: "auto" }}>
                Mis à jour {new Date(lastFetch).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          {/* Liste des articles */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", font: "400 13px var(--sans)", color: "var(--ink-3)" }}>
                Chargement des flux RSS…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", font: "400 13px var(--sans)", color: "var(--ink-3)" }}>
                Aucun article trouvé.
              </div>
            ) : (
              filtered.map((item) => (
                <div key={item.url}
                  onClick={() => selectItem(item)}
                  style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f6", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start",
                    background: selected?.id === item.id ? "#eff6ff" : "#fff",
                    borderLeft: selected?.id === item.id ? "3px solid var(--blue)" : "3px solid transparent" }}
                >
                  <div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "center" }}>
                      <span style={{ background: CAT_COLORS[item.category] ?? "#374151", color: "#fff", font: "700 9px var(--sans)", padding: "2px 6px", borderRadius: 2, letterSpacing: ".06em", textTransform: "uppercase" }}>
                        {item.category}
                      </span>
                      <span style={{ font: "600 10px var(--sans)", color: "var(--ink-3)" }}>{item.source}</span>
                      <span style={{ font: "400 10px var(--sans)", color: "var(--ink-3)" }}>· {item.date}</span>
                    </div>
                    <div style={{ font: "600 13px var(--sans)", color: "var(--ink)", lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ font: "400 11px var(--sans)", color: "var(--ink-2)", lineHeight: 1.5 }}>{item.excerpt.slice(0, 160)}{item.excerpt.length > 160 ? "…" : ""}</div>
                  </div>
                  {item.imgUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imgUrl} alt="" style={{ width: 70, height: 50, objectFit: "cover", borderRadius: 3, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Colonne droite : rédaction ────────────────────────────────── */}
        <div style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid #eef0f4" }}>
            {[["veille","📡 Source"], ["draft","✏️ Rédaction"]].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t as "veille"|"draft")}
                style={{ flex: 1, padding: "12px 0", font: `${tab === t ? "700" : "400"} 12px var(--sans)`, background: "none", border: "none", cursor: "pointer",
                  color: tab === t ? "var(--blue)" : "var(--ink-3)", borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent", marginBottom: -2 }}>
                {l}
              </button>
            ))}
          </div>

          {/* Tab : source sélectionnée */}
          {tab === "veille" && (
            <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>
              {!selected ? (
                <div style={{ marginTop: 60, textAlign: "center", color: "var(--ink-3)" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📡</div>
                  <div style={{ font: "600 14px var(--sans)", marginBottom: 6 }}>Sélectionnez un article</div>
                  <div style={{ font: "400 12px var(--sans)" }}>Cliquez sur un titre dans le flux pour le rédiger.</div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    <span style={{ background: CAT_COLORS[selected.category] ?? "#374151", color: "#fff", font: "700 9px var(--sans)", padding: "2px 7px", borderRadius: 2, letterSpacing: ".06em", textTransform: "uppercase" }}>{selected.category}</span>
                    <span style={{ font: "600 11px var(--sans)", color: "var(--ink-3)" }}>{selected.source}</span>
                  </div>
                  <div style={{ font: "700 15px var(--sans)", color: "var(--ink)", lineHeight: 1.4, marginBottom: 10 }}>{selected.title}</div>
                  <div style={{ font: "400 12px var(--sans)", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 14 }}>{selected.excerpt}</div>
                  <a href={selected.url} target="_blank" rel="noreferrer"
                    style={{ font: "400 11px var(--sans)", color: "var(--blue)", textDecoration: "underline" }}>
                    Lire l&apos;article source ↗
                  </a>
                  <div style={{ marginTop: 20 }}>
                    <button onClick={() => setTab("draft")}
                      style={{ width: "100%", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 0", font: "700 12px var(--sans)", cursor: "pointer" }}>
                      ✏️ Rédiger cet article →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab : rédaction */}
          {tab === "draft" && (
            <div style={{ padding: 20, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {selected && (
                <div style={{ padding: "8px 12px", background: "#f0f7ff", borderRadius: 4, font: "400 11px var(--sans)", color: "var(--blue)", borderLeft: "3px solid var(--blue)" }}>
                  Source : <strong>{selected.source}</strong> — {selected.title.slice(0, 60)}…
                </div>
              )}

              {/* Rubrique */}
              <div>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Rubrique *</label>
                <select value={draft.rubrique} onChange={e => setDraft(d => ({ ...d, rubrique: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 13px var(--sans)" }}>
                  {RUBRIQUES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {/* Bouton IA */}
              <button onClick={rewrite} disabled={rewriting || !selected}
                style={{ background: rewriting ? "#e5e7eb" : "#7c3aed", color: rewriting ? "#9ca3af" : "#fff", border: "none", borderRadius: 4, padding: "10px 0", font: "700 12px var(--sans)", cursor: rewriting ? "default" : "pointer", width: "100%" }}>
                {rewriting ? "✨ Réécriture en cours…" : "✨ Réécrire avec l'IA (Claude)"}
              </button>

              {/* Titre */}
              <div>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Titre *</label>
                <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="Titre de l'article"
                  style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "600 14px var(--serif)", boxSizing: "border-box" }} />
              </div>

              {/* Chapeau */}
              <div>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Chapeau (dek)</label>
                <textarea value={draft.dek} onChange={e => setDraft(d => ({ ...d, dek: e.target.value }))}
                  rows={2} placeholder="Résumé accrocheur en 1-2 phrases"
                  style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 12px var(--sans)", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Corps */}
              <div style={{ flex: 1 }}>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Corps de l&apos;article</label>
                <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                  rows={14} placeholder="Rédigez ou collez le texte ici…&#10;&#10;Séparez les paragraphes par une ligne vide."
                  style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 12px var(--sans)", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
              </div>

              {/* Auteur */}
              <div>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Auteur</label>
                <input value={draft.author} onChange={e => setDraft(d => ({ ...d, author: e.target.value }))}
                  placeholder="Rédaction À l'Heure"
                  style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 13px var(--sans)", boxSizing: "border-box" }} />
              </div>

              {/* Image */}
              <div>
                <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>
                  Image d&apos;illustration
                  {!draft.imgUrl && <span style={{ color: "#dc2626", marginLeft: 6 }}>⚠ obligatoire avant publication</span>}
                </label>
                {draft.imgUrl ? (
                  <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={draft.imgUrl} alt="aperçu" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 4, display: "block" }} />
                    <button onClick={() => setDraft(d => ({ ...d, imgUrl: "" }))}
                      style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,.55)", color: "#fff", border: "none", borderRadius: 3, padding: "2px 7px", font: "700 11px var(--sans)", cursor: "pointer" }}>
                      ✕ Changer
                    </button>
                  </div>
                ) : (
                  <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: 90, border: "2px dashed #d1d5db", borderRadius: 4, cursor: "pointer", background: "#fafafa" }}>
                    <span style={{ font: "600 12px var(--sans)", color: "var(--ink-2)" }}>{uploading ? "Envoi en cours…" : "📷 Cliquer pour téléverser"}</span>
                    <span style={{ font: "400 10px var(--sans)", color: "var(--ink-3)" }}>JPG, PNG, WebP</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
                  </label>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => saveDraft("draft")} disabled={saving}
                  style={{ padding: "10px 0", border: "1.5px solid var(--blue)", borderRadius: 4, font: "700 12px var(--sans)", cursor: "pointer", color: "var(--blue)", background: "#fff" }}>
                  {saving ? "…" : "💾 Brouillon"}
                </button>
                <button onClick={() => saveDraft("published")} disabled={saving}
                  style={{ padding: "10px 0", border: "none", borderRadius: 4, font: "700 12px var(--sans)", cursor: "pointer", color: "#fff", background: "var(--red)" }}>
                  {saving ? "…" : "✅ Publier"}
                </button>
              </div>

              <Link href="/admin" style={{ font: "400 11px var(--sans)", color: "var(--ink-3)", textDecoration: "none", textAlign: "center" }}>
                Voir tous les articles dans l&apos;admin →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
