"use client";
import { useState, useEffect } from "react";

interface Mot {
  id: string;
  word: string;
  pron: string;
  type: string;
  def: string;
  exemple: string;
  date: string;
  featured: boolean;
}

const EMPTY: Mot = { id: "", word: "", pron: "", type: "", def: "", exemple: "", date: "", featured: false };

export default function AdminWolof() {
  const [mots, setMots] = useState<Mot[]>([]);
  const [editing, setEditing] = useState<Mot | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/wolof").then(r => r.json()).then(setMots);
  }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    // Only one can be featured
    const list = isNew
      ? [...mots.map(m => editing.featured ? { ...m, featured: false } : m), editing]
      : mots.map(m => m.id === editing.id ? editing : (editing.featured ? { ...m, featured: false } : m));
    await fetch("/api/admin/wolof", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setMots(list);
    setEditing(null);
    setIsNew(false);
    setSaving(false);
    setMsg("Sauvegardé ✓");
    setTimeout(() => setMsg(""), 2000);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce mot ?")) return;
    const list = mots.filter(m => m.id !== id);
    await fetch("/api/admin/wolof", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setMots(list);
  }

  return (
    <div style={{ padding: 32, fontFamily: "var(--sans)", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <a href="/admin" style={{ font: "500 12px var(--sans)", color: "var(--blue)", textDecoration: "none" }}>← Admin</a>
          <h1 style={{ font: "800 28px var(--serif)", margin: "4px 0 0" }}>Mot du jour · Wolof</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ color: "green", font: "600 13px var(--sans)" }}>{msg}</span>}
          <button onClick={() => { setEditing({ ...EMPTY, id: `mot-${Date.now()}`, date: new Date().toISOString().slice(0, 10) }); setIsNew(true); }}
            style={{ background: "#0a5a3a", color: "#fff", border: "none", borderRadius: 4, padding: "9px 18px", font: "700 13px var(--sans)", cursor: "pointer" }}>
            + Nouveau mot
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ background: "#f0f7f3", border: "2px solid #0a5a3a", borderRadius: 8, padding: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ font: "700 16px var(--serif)", margin: 0 }}>{isNew ? "Nouveau mot" : "Modifier le mot"}</h2>
          {[
            ["Mot (en wolof)", "word"],
            ["Prononciation", "pron"],
            ["Type (n.f., n.m., expr.…)", "type"],
          ].map(([label, key]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>{label}</label>
              <input value={editing[key as keyof Mot] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
                style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
            </div>
          ))}
          {[["Définition", "def"], ["Exemple / citation", "exemple"]].map(([label, key]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>{label}</label>
              <textarea value={editing[key as keyof Mot] as string || ""} onChange={e => setEditing(p => p ? { ...p, [key]: e.target.value } : p)}
                rows={3} style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)", resize: "vertical" }} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Date</label>
              <input type="date" value={editing.date || ""} onChange={e => setEditing(p => p ? { ...p, date: e.target.value } : p)}
                style={{ padding: "8px 10px", border: "1px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing(p => p ? { ...p, featured: e.target.checked } : p)} />
                <span style={{ font: "600 13px var(--sans)" }}>⭐ Mot du jour (affiché en vedette)</span>
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ background: "#0a5a3a", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", font: "700 13px var(--sans)", cursor: "pointer" }}>
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "10px 18px", font: "600 13px var(--sans)", cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {mots.map(m => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--rule)", alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ font: "700 22px var(--serif)", color: "#0a5a3a", fontStyle: "italic" }}>{m.word}</span>
                <span style={{ font: "400 13px var(--sans)", color: "var(--ink-3)" }}>{m.pron} · {m.type}</span>
                {m.featured && <span style={{ background: "#f0fdf4", color: "#16a34a", font: "600 10px var(--sans)", padding: "2px 8px", borderRadius: 3, border: "1px solid #86efac" }}>⭐ Vedette</span>}
              </div>
              <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", margin: "0 0 2px" }}>{m.def}</p>
              <span style={{ font: "400 12px var(--sans)", color: "var(--ink-3)" }}>{m.date}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setEditing(m); setIsNew(false); }} style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 3, padding: "6px 14px", font: "600 12px var(--sans)", cursor: "pointer" }}>Modifier</button>
              <button onClick={() => remove(m.id)} style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 3, padding: "6px 12px", font: "600 12px var(--sans)", cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
