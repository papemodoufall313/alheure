"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/types";
import { RUBRIQUES_NAV } from "@/lib/types";

function bodyToText(body: Article["body"]): string {
  if (!body) return "";
  return body.map((b) => {
    if (b.type === "h2") return `## ${b.text}`;
    if (b.type === "blockquote") return `> ${b.text}${b.cite ? ` — ${b.cite}` : ""}`;
    if (b.type === "pullquote") return `pull: ${b.text}`;
    return b.text;
  }).join("\n\n");
}

function textToBody(text: string): Article["body"] {
  if (!text.trim()) return undefined;
  return text.split(/\n\n+/).map((line) => {
    line = line.trim();
    if (line.startsWith("## ")) return { type: "h2" as const, text: line.slice(3) };
    if (line.startsWith("> ")) {
      const content = line.slice(2);
      const dashIdx = content.lastIndexOf(" — ");
      if (dashIdx > 0) return { type: "blockquote" as const, text: content.slice(0, dashIdx), cite: content.slice(dashIdx + 3) };
      return { type: "blockquote" as const, text: content };
    }
    if (line.startsWith("pull: ")) return { type: "pullquote" as const, text: line.slice(6) };
    return { type: "p" as const, text: line };
  }).filter((b) => b.text.trim().length > 0);
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inp: React.CSSProperties = { width: "100%", border: "1px solid #c8d0dc", padding: "8px 10px", font: "400 14px var(--sans)", color: "var(--ink)", background: "#fff", boxSizing: "border-box", borderRadius: 2 };
const label: React.CSSProperties = { font: "700 12px var(--sans)", color: "var(--ink-2)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 4 };
const group: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

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
  const [imgAlt, setImgAlt] = useState(initial?.imgAlt ?? "");
  const [badge, setBadge] = useState<Article["badge"]>(initial?.badge);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [authorBio, setAuthorBio] = useState(initial?.authorBio ?? "");
  const [bodyText, setBodyText] = useState(bodyToText(initial?.body));

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
      imgAlt,
      ...(badge ? { badge } : {}),
      ...(featured ? { featured } : {}),
      ...(tags.trim() ? { tags: tags.split(",").map((t) => t.trim()).filter(Boolean) } : {}),
      ...(authorBio.trim() ? { authorBio } : {}),
      ...(bodyText.trim() ? { body: textToBody(bodyText) } : {}),
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

  const fieldStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && <div style={{ background: "#fde8e8", border: "1px solid #f8a0a0", padding: "10px 14px", color: "#a00", font: "400 14px var(--sans)", borderRadius: 2 }}>{error}</div>}

      <div style={group}>
        <span style={label}>Titre *</span>
        <input style={inp} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </div>

      <div style={fieldStyle}>
        <div style={group}>
          <span style={label}>Slug (URL) *</span>
          <input style={inp} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div style={group}>
          <span style={label}>Rubrique *</span>
          <select style={{ ...inp }} value={rubrique} onChange={(e) => setRubrique(e.target.value as Article["rubrique"])}>
            {RUBRIQUES_NAV.filter((r) => r.slug).map((r) => (
              <option key={r.slug} value={r.slug}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={group}>
        <span style={label}>Sous-titre (dek) *</span>
        <textarea style={{ ...inp, height: 72, resize: "vertical" }} value={dek} onChange={(e) => setDek(e.target.value)} required />
      </div>

      <div style={fieldStyle}>
        <div style={group}>
          <span style={label}>Label rubrique</span>
          <input style={inp} value={rubriqueLabel} onChange={(e) => setRubriqueLabel(e.target.value)} placeholder="ex: Sénégal · Saint-Louis" />
        </div>
        <div style={group}>
          <span style={label}>Auteur *</span>
          <input style={inp} value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
      </div>

      <div style={fieldStyle}>
        <div style={group}>
          <span style={label}>Date affichée *</span>
          <input style={inp} value={date} onChange={(e) => setDate(e.target.value)} placeholder="ex: Aujourd'hui · 14h00" required />
        </div>
        <div style={group}>
          <span style={label}>Date ISO</span>
          <input style={inp} type="datetime-local" value={dateIso} onChange={(e) => setDateIso(e.target.value)} />
        </div>
      </div>

      <div style={fieldStyle}>
        <div style={group}>
          <span style={label}>Temps de lecture</span>
          <input style={inp} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="ex: 5 min" />
        </div>
        <div style={group}>
          <span style={label}>Badge</span>
          <select style={{ ...inp }} value={badge ?? ""} onChange={(e) => setBadge((e.target.value as Article["badge"]) || undefined)}>
            <option value="">Aucun</option>
            <option value="rep">Grand reportage</option>
            <option value="longformat">Long format</option>
            <option value="video">Vidéo</option>
            <option value="live">Direct</option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <div style={group}>
          <span style={label}>Mot-clé image (imgSeed) *</span>
          <input style={inp} value={imgSeed} onChange={(e) => setImgSeed(e.target.value)} placeholder="ex: dakar-plage" required />
        </div>
        <div style={group}>
          <span style={label}>Description image (alt)</span>
          <input style={inp} value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} />
        </div>
      </div>

      <div style={group}>
        <span style={label}>Tags (séparés par des virgules)</span>
        <input style={inp} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: Dakar, Politique, Élections" />
      </div>

      <div style={group}>
        <span style={label}>Bio auteur</span>
        <textarea style={{ ...inp, height: 60, resize: "vertical" }} value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} />
      </div>

      <div style={group}>
        <span style={label}>Contenu de l'article</span>
        <p style={{ font: "400 12px var(--sans)", color: "var(--ink-2)", margin: "0 0 6px" }}>
          Un paragraphe par bloc (ligne vide entre chaque). Préfixes : <code>## </code> pour titre, <code>&gt; </code> pour citation, <code>pull: </code> pour mise en exergue.
        </p>
        <textarea style={{ ...inp, height: 280, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }} value={bodyText} onChange={(e) => setBodyText(e.target.value)} placeholder={"Votre premier paragraphe ici...\n\n## Un sous-titre\n\nDeuxième paragraphe.\n\n> Une citation — Auteur de la citation\n\npull: Une phrase mise en exergue."} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, font: "400 14px var(--sans)", cursor: "pointer" }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Article mis en avant (hero)
      </label>

      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button type="submit" disabled={saving} style={{ background: "var(--blue)", color: "#fff", border: "none", padding: "12px 28px", font: "700 13px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", cursor: saving ? "wait" : "pointer", opacity: saving ? .6 : 1 }}>
          {saving ? "Sauvegarde…" : isEdit ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} style={{ background: "transparent", color: "var(--ink-2)", border: "1px solid var(--ink-3)", padding: "12px 20px", font: "400 13px var(--sans)", cursor: "pointer" }}>
          Annuler
        </button>
      </div>
    </form>
  );
}
