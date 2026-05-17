"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Une { imgUrl: string; date: string; numero: string; headline: string; active: boolean }

export default function AdminUne() {
  const [une, setUne]       = useState<Une>({ imgUrl: "", date: "", numero: "", headline: "", active: false });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]       = useState({ text: "", error: false });
  const fileRef             = useRef<HTMLInputElement>(null);

  function flash(text: string, error = false) {
    setMsg({ text, error });
    setTimeout(() => setMsg({ text: "", error: false }), 3500);
  }

  useEffect(() => {
    fetch("/api/admin/une").then(r => r.json()).then(setUne);
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) { setUne(u => ({ ...u, imgUrl: data.url })); flash("Image uploadée ✓"); }
    else flash("Erreur upload", true);
  }

  async function save() {
    setSaving(true);
    try {
      const res  = await fetch("/api/admin/une", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", ...une }) });
      const data = await res.json();
      if (data.ok) flash("Une sauvegardée ✓");
      else flash(data.error ?? `Erreur ${res.status}`, true);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Erreur réseau", true);
    } finally {
      setSaving(false);
    }
  }

  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid var(--rule)", padding: "9px 12px", font: "400 14px var(--sans)", borderRadius: 4, boxSizing: "border-box" };
  const lbl: React.CSSProperties = { font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      <div style={{ background: "var(--blue)", padding: "0 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/admin" style={{ font: "400 11px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Admin</Link>
            <span style={{ font: "700 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>Une du jour</span>
            <span style={{ padding: "2px 10px", borderRadius: 20, font: "700 10px var(--sans)", letterSpacing: ".06em", background: une.active ? "#22c55e" : "#6b7280", color: "#fff" }}>
              {une.active ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          {msg.text && <span style={{ font: "600 12px var(--sans)", color: msg.error ? "#fca5a5" : "#86efac" }}>{msg.text}</span>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32, display: "grid", gridTemplateColumns: "1fr 260px", gap: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ font: "700 14px var(--sans)", color: "var(--ink)" }}>Afficher sur le site</div>
              <div style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", marginTop: 2 }}>La Une apparaît sur la page d&apos;accueil uniquement si activée</div>
            </div>
            <button onClick={() => setUne(u => ({ ...u, active: !u.active }))}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", background: une.active ? "#22c55e" : "#d1d5db", transition: "background .2s", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 2, left: une.active ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
            </button>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <label style={lbl}>Image de la Une *</label>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input style={{ ...inp, flex: 1 }} value={une.imgUrl} onChange={e => setUne(u => ({ ...u, imgUrl: e.target.value }))} placeholder="/uploads/une-17-mai-2026.jpg" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "9px 16px", font: "700 12px var(--sans)", cursor: "pointer", whiteSpace: "nowrap" }}>
                {uploading ? "Upload…" : "📎 Choisir"}
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Date d&apos;édition</label>
                <input style={inp} value={une.date} onChange={e => setUne(u => ({ ...u, date: e.target.value }))} placeholder="Dimanche 17 mai 2026" />
              </div>
              <div>
                <label style={lbl}>Numéro</label>
                <input style={inp} value={une.numero} onChange={e => setUne(u => ({ ...u, numero: e.target.value }))} placeholder="ex: 001" />
              </div>
            </div>
            <div>
              <label style={lbl}>Titre principal (optionnel)</label>
              <input style={inp} value={une.headline} onChange={e => setUne(u => ({ ...u, headline: e.target.value }))} placeholder="ex: Diomaye lance une nouvelle phase politique" />
            </div>
          </div>

          <button onClick={save} disabled={saving}
            style={{ background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "12px 28px", font: "700 13px var(--sans)", letterSpacing: ".06em", cursor: "pointer", alignSelf: "flex-start" }}>
            {saving ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </div>

        <div>
          <div style={{ font: "700 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 12 }}>Aperçu</div>
          {une.imgUrl ? (
            <div style={{ boxShadow: "0 4px 20px rgba(0,0,0,.18)", borderRadius: 2, overflow: "hidden" }}>
              <Image src={une.imgUrl} alt="Aperçu Une" width={260} height={368} style={{ display: "block", width: "100%", height: "auto" }} unoptimized />
            </div>
          ) : (
            <div style={{ width: "100%", height: 368, background: "#f3f4f6", border: "1px dashed #c8d0dc", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", font: "400 12px var(--sans)", color: "var(--ink-3)" }}>
              Aucune image
            </div>
          )}
          {une.date && <div style={{ font: "600 11px var(--sans)", color: "var(--ink-2)", marginTop: 10, textAlign: "center" }}>N°{une.numero} · {une.date}</div>}
        </div>
      </div>
    </div>
  );
}
