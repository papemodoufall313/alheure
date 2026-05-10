"use client";
import { useState, useEffect } from "react";

interface Episode {
  id: string;
  num: string;
  title: string;
  desc: string;
  duration: string;
  date: string;
  guest: string;
  spotifyUrl: string;
  appleUrl: string;
  published: boolean;
}

const EMPTY: Episode = { id: "", num: "", title: "", desc: "", duration: "", date: "", guest: "", spotifyUrl: "", appleUrl: "", published: true };

export default function AdminPodcasts() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [editing, setEditing] = useState<Episode | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/podcasts").then(r => r.json()).then(setEpisodes);
  }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const list = isNew ? [...episodes, editing] : episodes.map(e => e.id === editing.id ? editing : e);
    await fetch("/api/admin/podcasts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setEpisodes(list);
    setEditing(null);
    setIsNew(false);
    setSaving(false);
    setMsg("Sauvegardé ✓");
    setTimeout(() => setMsg(""), 2000);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet épisode ?")) return;
    const list = episodes.filter(e => e.id !== id);
    await fetch("/api/admin/podcasts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setEpisodes(list);
  }

  const F = (label: string, key: keyof Episode, type = "text") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>{label}</label>
      {key === "desc" ? (
        <textarea value={editing?.[key] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
          rows={3} style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)", resize: "vertical" }} />
      ) : key === "published" ? (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={!!editing?.[key]} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.checked } : p)} />
          <span style={{ font: "400 14px var(--sans)" }}>Publié</span>
        </label>
      ) : (
        <input type={type} value={editing?.[key] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
          style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
      )}
    </div>
  );

  return (
    <div style={{ padding: 32, fontFamily: "var(--sans)", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <a href="/admin" style={{ font: "500 12px var(--sans)", color: "var(--blue)", textDecoration: "none" }}>← Admin</a>
          <h1 style={{ font: "800 28px var(--serif)", margin: "4px 0 0" }}>Podcasts</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: "green", font: "600 13px var(--sans)" }}>{msg}</span>}
          <button onClick={() => { setEditing({ ...EMPTY, id: `ep${Date.now()}`, num: String(episodes.length + 1) }); setIsNew(true); }}
            style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "9px 18px", font: "700 13px var(--sans)", cursor: "pointer" }}>
            + Nouvel épisode
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ background: "#f9f8f5", border: "2px solid var(--blue)", borderRadius: 8, padding: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ font: "700 16px var(--serif)", margin: 0 }}>{isNew ? "Nouvel épisode" : "Modifier l'épisode"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 14 }}>
            {F("N°", "num")}
            {F("Titre", "title")}
          </div>
          {F("Description", "desc")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {F("Durée", "duration")}
            {F("Date", "date")}
            {F("Invité", "guest")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {F("URL Spotify", "spotifyUrl")}
            {F("URL Apple Podcasts", "appleUrl")}
          </div>
          {F("", "published")}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", font: "700 13px var(--sans)", cursor: "pointer" }}>
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "10px 18px", font: "600 13px var(--sans)", cursor: "pointer" }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {episodes.map(ep => (
          <div key={ep.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--rule)", alignItems: "center" }}>
            <span style={{ font: "800 22px var(--serif)", color: "var(--blue)", textAlign: "center" }}>{ep.num}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ font: "600 15px var(--serif)", color: "var(--ink)" }}>{ep.title}</span>
                {!ep.published && <span style={{ background: "#fef3c7", color: "#92400e", font: "600 10px var(--sans)", padding: "2px 6px", borderRadius: 3 }}>Brouillon</span>}
              </div>
              <span style={{ font: "400 12px var(--sans)", color: "var(--ink-3)" }}>{ep.date} · {ep.duration} · {ep.guest}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setEditing(ep); setIsNew(false); }} style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 3, padding: "6px 14px", font: "600 12px var(--sans)", cursor: "pointer" }}>Modifier</button>
              <button onClick={() => remove(ep.id)} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 3, padding: "6px 12px", font: "600 12px var(--sans)", cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
