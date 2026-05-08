"use client";
import type { ContentBlock } from "@/lib/types";

const META: Record<ContentBlock["type"], { label: string; color: string; placeholder: string; textStyle: React.CSSProperties }> = {
  p:          { label: "Paragraphe",       color: "#f0f2f6", placeholder: "Rédigez votre paragraphe…",              textStyle: { font: "400 14px/1.7 var(--sans)", color: "var(--ink)" } },
  h2:         { label: "Titre H2",         color: "#dbeafe", placeholder: "Votre sous-titre…",                      textStyle: { font: "700 20px/1.2 var(--serif)", fontStyle: "italic", color: "var(--blue)" } },
  blockquote: { label: "Citation",         color: "#fef3c7", placeholder: "Le texte de la citation…",               textStyle: { font: "400 14px/1.6 var(--sans)", fontStyle: "italic", color: "var(--ink)" } },
  pullquote:  { label: "Mise en exergue",  color: "#fce7e7", placeholder: "La phrase mise en avant…",               textStyle: { font: "700 16px/1.4 var(--serif)", fontStyle: "italic", color: "var(--red)", textAlign: "center" } },
};

const btnStyle: React.CSSProperties = { background: "none", border: "1px solid #dde2ea", borderRadius: 2, padding: "2px 7px", cursor: "pointer", font: "400 12px var(--sans)", color: "var(--ink-2)", lineHeight: 1.6 };

export default function BlockEditor({ value, onChange }: {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function addBlock(type: ContentBlock["type"]) {
    const block: ContentBlock = type === "blockquote"
      ? { type: "blockquote", text: "", cite: "" }
      : { type, text: "" } as ContentBlock;
    onChange([...value, block]);
  }

  function update(idx: number, patch: Record<string, string>) {
    const updated = [...value];
    updated[idx] = { ...updated[idx], ...patch } as ContentBlock;
    onChange(updated);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const arr = [...value];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    onChange(arr);
  }

  return (
    <div>
      {value.length === 0 && (
        <div style={{ border: "2px dashed #dde2ea", borderRadius: 4, padding: "28px 20px", textAlign: "center", color: "var(--ink-2)", font: "400 13px var(--sans)", marginBottom: 10 }}>
          Cliquez sur un bouton ci-dessous pour ajouter votre premier bloc
        </div>
      )}

      {value.map((block, idx) => {
        const m = META[block.type];
        return (
          <div key={idx} style={{ border: "1px solid #dde2ea", borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
            {/* Block toolbar */}
            <div style={{ background: m.color, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ font: "700 10px var(--sans)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-2)", flex: 1 }}>
                {m.label}
              </span>
              <select
                value={block.type}
                onChange={(e) => update(idx, { type: e.target.value })}
                style={{ font: "400 11px var(--sans)", border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-2)" }}
              >
                <option value="p">Paragraphe</option>
                <option value="h2">Titre H2</option>
                <option value="blockquote">Citation</option>
                <option value="pullquote">Mise en exergue</option>
              </select>
              <button style={btnStyle} onClick={() => move(idx, -1)} title="Monter">↑</button>
              <button style={btnStyle} onClick={() => move(idx, 1)} title="Descendre">↓</button>
              <button style={{ ...btnStyle, color: "var(--red)", borderColor: "var(--red)" }} onClick={() => remove(idx)} title="Supprimer">✕</button>
            </div>

            {/* Block content */}
            <div style={{ padding: "10px 12px", background: "#fff", borderLeft: block.type === "blockquote" ? "3px solid #f5c842" : block.type === "pullquote" ? "3px solid var(--red)" : "none" }}>
              <textarea
                value={block.text}
                onChange={(e) => update(idx, { text: e.target.value })}
                placeholder={m.placeholder}
                rows={block.type === "h2" ? 1 : block.type === "pullquote" ? 2 : 4}
                style={{ width: "100%", border: "none", outline: "none", resize: "vertical", background: "transparent", boxSizing: "border-box", ...m.textStyle }}
              />
              {block.type === "blockquote" && (
                <input
                  value={(block as { type: "blockquote"; text: string; cite?: string }).cite ?? ""}
                  onChange={(e) => update(idx, { cite: e.target.value })}
                  placeholder="— Source / auteur (optionnel)"
                  style={{ width: "100%", border: "none", borderTop: "1px dashed #e0e0e0", outline: "none", background: "transparent", font: "400 12px var(--sans)", color: "var(--ink-2)", paddingTop: 6, marginTop: 6 }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Add block buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
        {(["p", "h2", "blockquote", "pullquote"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            style={{ ...btnStyle, background: META[type].color, border: `1px solid ${META[type].color === "#f0f2f6" ? "#c8d0dc" : META[type].color}`, padding: "5px 12px", font: "600 11px var(--sans)", letterSpacing: ".04em" }}
          >
            + {META[type].label}
          </button>
        ))}
      </div>
    </div>
  );
}
