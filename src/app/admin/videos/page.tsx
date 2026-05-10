"use client";
import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  desc: string;
  duration: string;
  date: string;
  category: string;
  imgUrl: string;
  videoUrl: string;
  published: boolean;
}

const EMPTY: Video = { id: "", title: "", desc: "", duration: "", date: "", category: "", imgUrl: "", videoUrl: "", published: true };
const CATEGORIES = ["Grand reportage", "Sport", "Culture", "Société", "Politique", "Football", "Économie", "International"];

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editing, setEditing] = useState<Video | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/videos").then(r => r.json()).then(setVideos);
  }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const list = isNew ? [...videos, editing] : videos.map(v => v.id === editing.id ? editing : v);
    await fetch("/api/admin/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setVideos(list);
    setEditing(null);
    setIsNew(false);
    setSaving(false);
    setMsg("Sauvegardé ✓");
    setTimeout(() => setMsg(""), 2000);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette vidéo ?")) return;
    const list = videos.filter(v => v.id !== id);
    await fetch("/api/admin/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setVideos(list);
  }

  const F = (label: string, key: keyof Video) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>{label}</label>
      {key === "desc" ? (
        <textarea value={editing?.[key] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
          rows={2} style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)", resize: "vertical" }} />
      ) : key === "category" ? (
        <select value={editing?.[key] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
          style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }}>
          <option value="">— Catégorie —</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : key === "published" ? (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={!!editing?.[key]} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.checked } : p)} />
          <span style={{ font: "400 14px var(--sans)" }}>Publié</span>
        </label>
      ) : (
        <input type="text" value={editing?.[key] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
          style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
      )}
    </div>
  );

  return (
    <div style={{ padding: 32, fontFamily: "var(--sans)", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <a href="/admin" style={{ font: "500 12px var(--sans)", color: "var(--blue)", textDecoration: "none" }}>← Admin</a>
          <h1 style={{ font: "800 28px var(--serif)", margin: "4px 0 0" }}>Vidéos</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: "green", font: "600 13px var(--sans)" }}>{msg}</span>}
          <button onClick={() => { setEditing({ ...EMPTY, id: `vid-${Date.now()}` }); setIsNew(true); }}
            style={{ background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "9px 18px", font: "700 13px var(--sans)", cursor: "pointer" }}>
            + Nouvelle vidéo
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ background: "#f9f8f5", border: "2px solid var(--red)", borderRadius: 8, padding: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ font: "700 16px var(--serif)", margin: 0 }}>{isNew ? "Nouvelle vidéo" : "Modifier la vidéo"}</h2>
          {F("Titre", "title")}
          {F("Description", "desc")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {F("Durée", "duration")}
            {F("Date", "date")}
            {F("Catégorie", "category")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {F("URL vidéo (YouTube, Vimeo…)", "videoUrl")}
            {F("Image miniature (chemin /uploads/...)", "imgUrl")}
          </div>
          {F("", "published")}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", font: "700 13px var(--sans)", cursor: "pointer" }}>
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "10px 18px", font: "600 13px var(--sans)", cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {videos.map(v => (
          <div key={v.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--rule)", alignItems: "center" }}>
            {v.imgUrl ? <img src={v.imgUrl} alt="" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 3 }} /> : <div style={{ width: 80, height: 50, background: "#eee", borderRadius: 3 }} />}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ font: "600 14px var(--serif)" }}>{v.title}</span>
                <span style={{ background: "#fee2e2", color: "var(--red)", font: "600 10px var(--sans)", padding: "2px 6px", borderRadius: 3 }}>{v.category}</span>
                {!v.published && <span style={{ background: "#fef3c7", color: "#92400e", font: "600 10px var(--sans)", padding: "2px 6px", borderRadius: 3 }}>Brouillon</span>}
              </div>
              <span style={{ font: "400 12px var(--sans)", color: "var(--ink-3)" }}>{v.date} · {v.duration}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setEditing(v); setIsNew(false); }} style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 3, padding: "6px 14px", font: "600 12px var(--sans)", cursor: "pointer" }}>Modifier</button>
              <button onClick={() => remove(v.id)} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 3, padding: "6px 12px", font: "600 12px var(--sans)", cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
