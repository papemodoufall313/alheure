"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, ContentBlock } from "@/lib/types";
import { RUBRIQUES_NAV } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

function slugify(str: string) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inp: React.CSSProperties = { width: "100%", border: "1px solid #c8d0dc", padding: "8px 10px", font: "400 14px var(--sans)", color: "var(--ink)", background: "#fff", boxSizing: "border-box", borderRadius: 2 };
const lbl: React.CSSProperties = { font: "700 11px var(--sans)", color: "var(--ink-2)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 4 };
const grp: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
const sectionHead: React.CSSProperties = { font: "700 13px var(--sans)", color: "var(--blue)", borderBottom: "2px solid var(--blue)", paddingBottom: 6, marginBottom: 16, marginTop: 8, textTransform: "uppercase", letterSpacing: ".08em" };

export default function ArticleForm({ initial, isEdit }: { initial?: Partial<Article>; isEdit?: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [dek, setDek] = useState(initial?.dek ?? "");
  const [rubrique, setRubrique] = useState<Article["rubrique"]>(initial?.rubrique ?? "senegal");
  const [rubriqueLabel, setRubriqueLabel] = useState(initial?.rubriqueLabel ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [dateIso, setDateIso] = useState(initial?.dateIso ?? "");
  const [readTime, setReadTime] = useState(initial?.readTime ?? "");
  const [imgSeed, setImgSeed] = useState(initial?.imgSeed ?? "");
  const [imgUrl, setImgUrl] = useState(initial?.imgUrl ?? "");
  const [imgAlt, setImgAlt] = useState(initial?.imgAlt ?? "");
  const [badge, setBadge] = useState<Article["badge"]>(initial?.badge);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [authorBio, setAuthorBio] = useState(initial?.authorBio ?? "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(initial?.body ?? []);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!isEdit) setSlug(slugify(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const article: Article = {
      slug,
      title,
      dek,
      rubrique,
      rubriqueLabel: rubriqueLabel || (RUBRIQUES_NAV.find((r) => r.slug === rubrique)?.label ?? rubrique),
      author,
      date,
      dateIso,
      readTime,
      imgSeed,
      ...(imgUrl ? { imgUrl } : {}),
      imgAlt,
      ...(badge ? { badge } : {}),
      ...(featured ? { featured } : {}),
      ...(tags.trim() ? { tags: tags.split(",").map((t) => t.trim()).filter(Boolean) } : {}),
      ...(authorBio.trim() ? { authorBio } : {}),
      ...(blocks.length > 0 ? { body: blocks } : {}),
    };

    const url = isEdit ? `/api/articles/${initial?.slug}` : "/api/articles";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(article) });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la sauvegarde");
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && (
        <div style={{ background: "#fde8e8", border: "1px solid #f8a0a0", padding: "10px 14px", color: "#a00", font: "400 14px var(--sans)", borderRadius: 2 }}>
          {error}
        </div>
      )}

      {/* ── Identité ── */}
      <p style={sectionHead}>Identité de l&apos;article</p>

      <div style={grp}>
        <span style={lbl}>Titre *</span>
        <input style={inp} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </div>

      <div style={row}>
        <div style={grp}>
          <span style={lbl}>Slug (URL) *</span>
          <input style={inp} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div style={grp}>
          <span style={lbl}>Rubrique *</span>
          <select style={inp} value={rubrique} onChange={(e) => setRubrique(e.target.value as Article["rubrique"])}>
            {RUBRIQUES_NAV.filter((r) => r.slug).map((r) => (
              <option key={r.slug} value={r.slug}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={grp}>
        <span style={lbl}>Sous-titre (dek) *</span>
        <textarea style={{ ...inp, height: 72, resize: "vertical" }} value={dek} onChange={(e) => setDek(e.target.value)} required />
      </div>

      <div style={row}>
        <div style={grp}>
          <span style={lbl}>Label rubrique</span>
          <input style={inp} value={rubriqueLabel} onChange={(e) => setRubriqueLabel(e.target.value)} placeholder="ex: Sénégal · Saint-Louis" />
        </div>
        <div style={grp}>
          <span style={lbl}>Auteur *</span>
          <input style={inp} value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
      </div>

      <div style={row}>
        <div style={grp}>
          <span style={lbl}>Date affichée *</span>
          <input style={inp} value={date} onChange={(e) => setDate(e.target.value)} placeholder="ex: Aujourd'hui · 14h00" required />
        </div>
        <div style={grp}>
          <span style={lbl}>Date ISO</span>
          <input style={inp} type="datetime-local" value={dateIso} onChange={(e) => setDateIso(e.target.value)} />
        </div>
      </div>

      <div style={row}>
        <div style={grp}>
          <span style={lbl}>Temps de lecture</span>
          <input style={inp} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="ex: 5 min" />
        </div>
        <div style={grp}>
          <span style={lbl}>Badge</span>
          <select style={inp} value={badge ?? ""} onChange={(e) => setBadge((e.target.value as Article["badge"]) || undefined)}>
            <option value="">Aucun</option>
            <option value="rep">Grand reportage</option>
            <option value="longformat">Long format</option>
            <option value="video">Vidéo</option>
            <option value="live">Direct</option>
          </select>
        </div>
      </div>

      {/* ── Image ── */}
      <p style={sectionHead}>Image de couverture</p>

      <ImageUpload imgSeed={imgSeed} imgUrl={imgUrl} onSeedChange={setImgSeed} onUrlChange={setImgUrl} />

      <div style={grp}>
        <span style={lbl}>Description de l&apos;image (alt)</span>
        <input style={inp} value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="ex: Vue aérienne de Dakar" />
      </div>

      {/* ── Contenu ── */}
      <p style={sectionHead}>Contenu de l&apos;article</p>
      <RichTextEditor value={blocks} onChange={setBlocks} />

      {/* ── Métadonnées ── */}
      <p style={sectionHead}>Métadonnées</p>

      <div style={grp}>
        <span style={lbl}>Tags (séparés par des virgules)</span>
        <input style={inp} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: Dakar, Politique, Élections" />
      </div>

      <div style={grp}>
        <span style={lbl}>Bio auteur</span>
        <textarea style={{ ...inp, height: 60, resize: "vertical" }} value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, font: "400 14px var(--sans)", cursor: "pointer" }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Article mis en avant (apparaît en hero sur l&apos;accueil)
      </label>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: "1px solid #dde2ea" }}>
        <button
          type="submit"
          disabled={saving}
          style={{ background: "var(--blue)", color: "#fff", border: "none", padding: "12px 28px", font: "700 13px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", cursor: saving ? "wait" : "pointer", opacity: saving ? .6 : 1, borderRadius: 2 }}
        >
          {saving ? "Sauvegarde…" : isEdit ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          style={{ background: "transparent", color: "var(--ink-2)", border: "1px solid #c8d0dc", padding: "12px 20px", font: "400 13px var(--sans)", cursor: "pointer", borderRadius: 2 }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
