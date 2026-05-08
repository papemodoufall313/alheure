"use client";
import { useRef, useState } from "react";

interface Props {
  imgSeed: string;
  imgUrl: string;
  onSeedChange: (v: string) => void;
  onUrlChange: (v: string) => void;
}

export default function ImageUpload({ imgSeed, imgUrl, onSeedChange, onUrlChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewSrc = imgUrl
    ? imgUrl
    : imgSeed
    ? `https://picsum.photos/seed/${imgSeed}/800/450`
    : null;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) {
      onUrlChange(data.url);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const inp: React.CSSProperties = { width: "100%", border: "1px solid #c8d0dc", padding: "8px 10px", font: "400 14px var(--sans)", color: "var(--ink)", background: "#fff", boxSizing: "border-box", borderRadius: 2 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Preview */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#e8edf5", borderRadius: 4, overflow: "hidden", border: "1px solid #dde2ea" }}>
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--ink-3)", font: "400 13px var(--sans)" }}>
            Aperçu de l&apos;image
          </div>
        )}
        {imgUrl && (
          <button
            type="button"
            onClick={() => onUrlChange("")}
            style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", font: "700 14px var(--sans)", lineHeight: 1 }}
            title="Supprimer l'image uploadée"
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
        {/* Seed input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ font: "700 11px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
            Mot-clé image (picsum seed)
          </span>
          <input
            style={inp}
            value={imgSeed}
            onChange={(e) => { onSeedChange(e.target.value); onUrlChange(""); }}
            placeholder="ex: dakar-plage"
            disabled={!!imgUrl}
          />
        </div>

        {/* Upload button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ font: "700 11px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
            Ou uploader
          </span>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ background: "var(--blue)", color: "#fff", border: "none", padding: "9px 16px", font: "600 12px var(--sans)", cursor: uploading ? "wait" : "pointer", opacity: uploading ? .6 : 1, whiteSpace: "nowrap", borderRadius: 2 }}
          >
            {uploading ? "Upload…" : "📁 Choisir un fichier"}
          </button>
        </div>
      </div>

      {imgUrl && (
        <p style={{ font: "400 11px var(--sans)", color: "#4a8c4a", margin: 0 }}>
          ✓ Image uploadée : {imgUrl}
        </p>
      )}
    </div>
  );
}
