"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Dossier = {
  id: string;
  active: boolean;
  imgUrl: string;
  alt: string;
  label: string;
  title: string;
  dek: string;
  episode: string;
  href: string;
};

const empty: Omit<Dossier, "id" | "active"> = {
  imgUrl: "", alt: "", label: "", title: "", dek: "", episode: "", href: "#",
};

export default function AdminDossiersPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [form, setForm] = useState<Omit<Dossier, "id" | "active">>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch("/api/admin/dossiers");
    setDossiers(await r.json());
  }

  useEffect(() => { load(); }, []);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/admin/dossiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update", id: editing, dossier: form }),
        });
        flash("Dossier mis à jour ✓");
      } else {
        await fetch("/api/admin/dossiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", dossier: form }),
        });
        flash("Dossier ajouté ✓");
      }
      setForm(empty);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggle(id: string) {
    await fetch("/api/admin/dossiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id }),
    });
    load();
  }

  async function del(id: string, title: string) {
    if (!confirm(`Supprimer « ${title} » ?`)) return;
    await fetch("/api/admin/dossiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    load();
  }

  function edit(d: Dossier) {
    setEditing(d.id);
    const { id: _id, active: _active, ...rest } = d;
    setForm(rest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() { setEditing(null); setForm(empty); }

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: "1px solid #ddd",
    borderRadius: 5, font: "400 14px system-ui", color: "#111", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { font: "600 12px system-ui", color: "#444", display: "block", marginBottom: 4 };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <Link href="/admin" style={{ font: "400 13px system-ui", color: "#666", textDecoration: "none" }}>← Admin</Link>
        <h1 style={{ font: "700 22px system-ui", margin: 0 }}>Nos dossiers</h1>
        {msg && <span style={{ marginLeft: "auto", background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: 4, font: "600 13px system-ui" }}>{msg}</span>}
      </div>

      {/* Formulaire */}
      <form onSubmit={submit} style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: 8, padding: 24, marginBottom: 32 }}>
        <h2 style={{ font: "700 16px system-ui", margin: "0 0 20px", color: "#111" }}>
          {editing ? "Modifier le dossier" : "Nouveau dossier"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Titre *</label>
            <input style={inp} required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Pétrole et gaz : la promesse, le doute…" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Résumé (dek)</label>
            <textarea style={{ ...inp, minHeight: 72, resize: "vertical" }} value={form.dek} onChange={e => setForm(f => ({ ...f, dek: e.target.value }))} placeholder="Description courte du dossier…" />
          </div>
          <div>
            <label style={lbl}>Label (ex : Série · 6 épisodes)</label>
            <input style={inp} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Long format" />
          </div>
          <div>
            <label style={lbl}>Sous-titre / épisode</label>
            <input style={inp} value={form.episode} onChange={e => setForm(f => ({ ...f, episode: e.target.value }))} placeholder="Épisode 4 · « À qui profite la manne ? »" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>URL de l&apos;image de couverture</label>
            <input style={inp} value={form.imgUrl} onChange={e => setForm(f => ({ ...f, imgUrl: e.target.value }))} placeholder="https://…" />
          </div>
          <div>
            <label style={lbl}>Texte alternatif image</label>
            <input style={inp} value={form.alt} onChange={e => setForm(f => ({ ...f, alt: e.target.value }))} placeholder="Description de l'image" />
          </div>
          <div>
            <label style={lbl}>Lien (href)</label>
            <input style={inp} value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} placeholder="/article/mon-dossier" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button type="submit" disabled={saving} style={{ padding: "10px 24px", background: "#1a3a5c", color: "#fff", border: "none", borderRadius: 5, font: "700 14px system-ui", cursor: "pointer" }}>
            {saving ? "Enregistrement…" : editing ? "Mettre à jour" : "Ajouter le dossier"}
          </button>
          {editing && (
            <button type="button" onClick={cancel} style={{ padding: "10px 18px", background: "#fff", border: "1px solid #ddd", borderRadius: 5, font: "400 14px system-ui", cursor: "pointer" }}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste */}
      <h2 style={{ font: "700 15px system-ui", color: "#333", margin: "0 0 14px" }}>
        {dossiers.length} dossier{dossiers.length > 1 ? "s" : ""}
      </h2>
      {dossiers.length === 0 && (
        <p style={{ color: "#888", font: "400 14px system-ui" }}>Aucun dossier. Ajoutez-en un ci-dessus.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dossiers.map((d) => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, alignItems: "center", background: d.active ? "#fff" : "#f9f9f9", border: "1px solid #e5e5e5", borderRadius: 7, padding: "12px 16px", opacity: d.active ? 1 : .65 }}>
            {d.imgUrl
              ? <img src={d.imgUrl} alt={d.alt} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 4, display: "block" }} />
              : <div style={{ width: 56, height: 40, background: "#e5e5e5", borderRadius: 4 }} />
            }
            <div>
              <div style={{ font: "600 14px system-ui", color: "#111", marginBottom: 2 }}>{d.title}</div>
              <div style={{ font: "400 12px system-ui", color: "#888" }}>
                {d.label && <span style={{ marginRight: 8 }}>{d.label}</span>}
                {d.active
                  ? <span style={{ color: "#15803d", fontWeight: 600 }}>● Visible</span>
                  : <span style={{ color: "#999" }}>● Masqué</span>
                }
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => toggle(d.id)} style={{ padding: "5px 12px", border: "1px solid #ddd", borderRadius: 4, font: "400 12px system-ui", cursor: "pointer", background: "#fff" }}>
                {d.active ? "Masquer" : "Afficher"}
              </button>
              <button onClick={() => edit(d)} style={{ padding: "5px 12px", border: "1px solid #1a3a5c", borderRadius: 4, font: "400 12px system-ui", cursor: "pointer", background: "#fff", color: "#1a3a5c" }}>
                Modifier
              </button>
              <button onClick={() => del(d.id, d.title)} style={{ padding: "5px 12px", border: "1px solid #fca5a5", borderRadius: 4, font: "400 12px system-ui", cursor: "pointer", background: "#fff", color: "#dc2626" }}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
