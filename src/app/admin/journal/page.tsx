"use client";
import { useState, useEffect } from "react";

interface JournalFile {
  name: string;
  path: string;
  type: "pdf" | "docx";
}

export default function AdminJournal() {
  const [files, setFiles]     = useState<JournalFile[]>([]);
  const [date, setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [numero, setNumero]   = useState(1);
  const [format, setFormat]   = useState<"docx" | "pdf">("docx");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text: "", error: false });

  function refreshList() {
    fetch("/api/admin/generate-journal").then((r) => r.json()).then(setFiles);
  }

  useEffect(() => { refreshList(); }, []);

  function flash(text: string, error = false) {
    setMsg({ text, error });
    setTimeout(() => setMsg({ text: "", error: false }), 5000);
  }

  async function generate() {
    setLoading(true);
    const res  = await fetch("/api/admin/generate-journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, numero, format }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { flash(data.error, true); }
    else { flash(`Journal généré ✓ — ${data.path}`); refreshList(); }
  }

  const ICON: Record<string, string> = { pdf: "🔴", docx: "📝" };
  const FORMAT_COLOR: Record<string, string> = { pdf: "#fee2e2", docx: "#dbeafe" };
  const FORMAT_TEXT:  Record<string, string> = { pdf: "#dc2626", docx: "#1d4ed8" };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/admin" style={{ font: "400 12px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Admin</a>
            <span style={{ font: "700 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>Générateur de journal</span>
          </div>
          {msg.text && (
            <span style={{ font: "600 12px var(--sans)", color: msg.error ? "#fca5a5" : "#86efac", maxWidth: 420 }}>{msg.text}</span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px" }}>

        {/* Formulaire */}
        <div style={{ background: "#fff", border: "2px solid var(--blue)", borderRadius: 8, padding: 28, marginBottom: 28 }}>
          <h2 style={{ font: "700 20px var(--serif)", margin: "0 0 6px", fontStyle: "italic" }}>Générer le journal du jour</h2>
          <p style={{ font: "400 13px var(--sans)", color: "var(--ink-2)", margin: "0 0 22px" }}>
            Construit automatiquement à partir des articles publiés sur le site.
            <strong style={{ color: "var(--blue)" }}> Local uniquement</strong> (pas sur Vercel).
          </p>

          {/* Choix du format */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 8 }}>Format de sortie</div>
            <div style={{ display: "flex", gap: 10 }}>
              {(["docx", "pdf"] as const).map((f) => (
                <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 18px", border: `2px solid ${format === f ? "var(--blue)" : "var(--rule)"}`, borderRadius: 6, background: format === f ? "#eff6ff" : "#fff" }}>
                  <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} style={{ accentColor: "var(--blue)" }} />
                  <div>
                    <div style={{ font: "700 13px var(--sans)", color: format === f ? "var(--blue)" : "var(--ink-2)" }}>
                      {f === "docx" ? "📝 Word (.docx)" : "🔴 PDF (.pdf)"}
                    </div>
                    <div style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>
                      {f === "docx" ? "Modifiable — texte, images, mise en page" : "Impression directe"}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px auto", gap: 14, alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Date d&apos;édition</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{ padding: "9px 12px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>N° du journal</label>
              <input type="number" min={1} value={numero} onChange={(e) => setNumero(Number(e.target.value))}
                style={{ padding: "9px 12px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }} />
            </div>
            <button onClick={generate} disabled={loading}
              style={{ background: "var(--red)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", font: "700 13px var(--sans)", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Génération…" : `Générer le ${format.toUpperCase()}`}
            </button>
          </div>

          {/* Maquette 8 pages */}
          <div style={{ marginTop: 22, padding: "14px 18px", background: "#f8f9fb", borderRadius: 6, border: "1px solid #dde2ea" }}>
            <div style={{ font: "700 10px var(--sans)", color: "var(--ink-2)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Maquette 8 pages</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
              {[["1","UNE","var(--blue)"],["2","Actualités","#374151"],["3","Actualités","#374151"],["4","Société","#15803d"],["5","ActuAfrique","#b45309"],["6","Sport","#dc2626"],["7","Culture","#7c3aed"],["8","Portrait / Interview","#1d4ed8"]].map(([num, label, color]) => (
                <div key={num} style={{ textAlign: "center" }}>
                  <div style={{ background: color as string, color: "#fff", borderRadius: 3, padding: "7px 4px 5px", font: "700 13px var(--serif)", fontStyle: "italic", marginBottom: 4 }}>{num}</div>
                  <div style={{ font: "500 9px var(--sans)", color: "var(--ink-3)", lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Commande terminal */}
          <div style={{ marginTop: 14, padding: "11px 16px", background: "#1a1a1a", borderRadius: 4 }}>
            <div style={{ font: "600 10px var(--sans)", color: "#6b7280", marginBottom: 4, letterSpacing: ".06em" }}>TERMINAL</div>
            <code style={{ font: "12px monospace", color: "#86efac" }}>
              python3 generate_journal_{format === "docx" ? "docx" : ""}.py --date {date} --numero {numero}
            </code>
          </div>
        </div>

        {/* Liste des fichiers */}
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--rule)" }}>
            <h2 style={{ font: "700 16px var(--serif)", margin: 0 }}>Fichiers générés ({files.length})</h2>
          </div>
          {files.length === 0 ? (
            <div style={{ padding: "36px 24px", textAlign: "center", font: "400 13px var(--sans)", color: "var(--ink-3)" }}>
              Aucun fichier généré pour l&apos;instant.
            </div>
          ) : (
            files.map((f, i) => {
              const datePart = f.name.replace(/^alheure-/, "").replace(/\.(pdf|docx)$/, "");
              const [y, m, d] = datePart.split("-");
              const label = y && m && d ? `${d}/${m}/${y}` : f.name;
              return (
                <div key={f.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 24px", borderBottom: i < files.length - 1 ? "1px solid var(--rule)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 38, height: 38, background: FORMAT_COLOR[f.type], borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", font: "700 11px var(--sans)", color: FORMAT_TEXT[f.type] }}>
                      {f.type.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ font: "600 13px var(--sans)", color: "var(--ink)" }}>{f.name}</div>
                      <div style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>Édition du {label} · {ICON[f.type]} {f.type === "docx" ? "Word — modifiable" : "PDF — impression"}</div>
                    </div>
                  </div>
                  <a href={f.path} download style={{ background: f.type === "docx" ? "var(--blue)" : "var(--red)", color: "#fff", padding: "7px 16px", font: "600 12px var(--sans)", textDecoration: "none", borderRadius: 4 }}>
                    ↓ Télécharger
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
