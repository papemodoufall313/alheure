"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface TickerItem { id: string; time: string; text: string; active: boolean }

export default function AdminTicker() {
  const [items,   setItems]   = useState<TickerItem[]>([]);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState(new Date().toTimeString().slice(0, 5));
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState({ text: "", time: "" });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ text: "", error: false });

  function flash(text: string, error = false) {
    setMsg({ text, error });
    setTimeout(() => setMsg({ text: "", error: false }), 3500);
  }

  async function load() {
    const res  = await fetch("/api/admin/ticker");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function call(body: object) {
    setSaving(true);
    const res  = await fetch("/api/admin/ticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (data.error) { flash(data.error, true); return false; }
    setItems(data.items);
    return true;
  }

  async function addItem() {
    if (!newText.trim()) { flash("Le texte est obligatoire.", true); return; }
    const ok = await call({ action: "add", text: newText, time: newTime });
    if (ok) { setNewText(""); flash("Info ajoutée ✓"); }
  }

  function startEdit(item: TickerItem) {
    setEditing(item.id);
    setEditVal({ text: item.text, time: item.time });
  }

  async function saveEdit(id: string) {
    const ok = await call({ action: "update", id, text: editVal.text, time: editVal.time });
    if (ok) { setEditing(null); flash("Modifié ✓"); }
  }

  const activeCount = items.filter(i => i.active).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", padding: "0 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/admin" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Admin</Link>
            <span style={{ font: "700 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>Bandeau « En continu »</span>
            <span style={{ font: "400 11px var(--sans)", color: "#6070a0" }}>
              {activeCount} actif{activeCount > 1 ? "s" : ""} / {items.length} total
            </span>
          </div>
          {msg.text && (
            <span style={{ font: "600 12px var(--sans)", color: msg.error ? "#fca5a5" : "#86efac" }}>{msg.text}</span>
          )}
        </div>
      </div>

      {/* Aperçu du bandeau */}
      <div style={{ background: "var(--red)", color: "#fff", padding: "0 32px", height: 40, display: "flex", alignItems: "center", gap: 0, overflow: "hidden" }}>
        <span style={{ background: "#fff", color: "var(--red)", font: "800 10px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 12px", flexShrink: 0, marginRight: 16 }}>
          En continu
        </span>
        <span style={{ font: "400 12px var(--sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {items.filter(i => i.active).map(i => `${i.time} — ${i.text}`).join("  ●  ") || "Aucune info active"}
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px" }}>

        {/* Formulaire d'ajout */}
        <div style={{ background: "#fff", border: "2px solid var(--blue)", borderRadius: 8, padding: 24, marginBottom: 28 }}>
          <h2 style={{ font: "700 17px var(--serif)", fontStyle: "italic", margin: "0 0 16px" }}>Ajouter une info</h2>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", gap: 10, alignItems: "flex-end" }}>
            <div>
              <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Heure</label>
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 13px var(--sans)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ font: "600 10px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Texte de l&apos;info *</label>
              <input
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addItem(); }}
                placeholder="Ex : Conseil des ministres — adoption du budget rectificatif"
                style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 13px var(--sans)", boxSizing: "border-box" }} />
            </div>
            <button onClick={addItem} disabled={saving}
              style={{ background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "9px 20px", font: "700 12px var(--sans)", cursor: "pointer", whiteSpace: "nowrap" }}>
              + Ajouter
            </button>
          </div>
        </div>

        {/* Liste des infos */}
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ font: "700 15px var(--serif)", margin: 0 }}>Infos du bandeau ({items.length})</h2>
            <span style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>Les infos désactivées restent sauvegardées mais n&apos;apparaissent pas</span>
          </div>

          {items.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", font: "400 13px var(--sans)", color: "var(--ink-3)" }}>
              Aucune info pour le moment.
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #f0f2f6" : "none",
                background: item.active ? "#fff" : "#fafafa", opacity: item.active ? 1 : 0.6 }}>

                {editing === item.id ? (
                  /* Mode édition */
                  <div style={{ padding: "14px 24px", display: "grid", gridTemplateColumns: "90px 1fr auto auto", gap: 10, alignItems: "center" }}>
                    <input type="time" value={editVal.time} onChange={e => setEditVal(v => ({ ...v, time: e.target.value }))}
                      style={{ padding: "7px 8px", border: "1.5px solid var(--blue)", borderRadius: 4, font: "400 13px var(--sans)" }} />
                    <input value={editVal.text} onChange={e => setEditVal(v => ({ ...v, text: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(item.id); if (e.key === "Escape") setEditing(null); }}
                      style={{ padding: "7px 10px", border: "1.5px solid var(--blue)", borderRadius: 4, font: "400 13px var(--sans)" }} />
                    <button onClick={() => saveEdit(item.id)} disabled={saving}
                      style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "7px 14px", font: "700 11px var(--sans)", cursor: "pointer" }}>
                      ✓ OK
                    </button>
                    <button onClick={() => setEditing(null)}
                      style={{ background: "#f3f4f6", color: "var(--ink-2)", border: "none", borderRadius: 4, padding: "7px 12px", font: "600 11px var(--sans)", cursor: "pointer" }}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  /* Mode lecture */
                  <div style={{ padding: "13px 24px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center" }}>
                    {/* Toggle actif */}
                    <button onClick={() => call({ action: "toggle", id: item.id })} title={item.active ? "Désactiver" : "Activer"}
                      style={{ width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", position: "relative",
                        background: item.active ? "#22c55e" : "#d1d5db", transition: "background .2s", flexShrink: 0 }}>
                      <span style={{ position: "absolute", top: 2, left: item.active ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
                    </button>

                    <div>
                      <span style={{ font: "700 12px var(--sans)", color: "var(--red)", marginRight: 10 }}>{item.time}</span>
                      <span style={{ font: "400 13px var(--sans)", color: "var(--ink)" }}>{item.text}</span>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => startEdit(item)}
                        style={{ padding: "5px 10px", border: "1px solid #dde2ea", borderRadius: 4, font: "400 11px var(--sans)", color: "var(--blue)", background: "#fff", cursor: "pointer" }}>
                        ✏️ Modifier
                      </button>
                      <button onClick={() => { if (confirm("Supprimer cette info ?")) call({ action: "delete", id: item.id }); }}
                        style={{ padding: "5px 10px", border: "1px solid #fca5a5", borderRadius: 4, font: "400 11px var(--sans)", color: "#dc2626", background: "#fff", cursor: "pointer" }}>
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <p style={{ font: "400 11px var(--sans)", color: "var(--ink-3)", marginTop: 16, textAlign: "center" }}>
          Les modifications sont visibles immédiatement sur le site sans redémarrage.
        </p>
      </div>
    </div>
  );
}
