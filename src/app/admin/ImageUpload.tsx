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
  const [uploadError, setUploadError] = useState("");
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
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setUploadError(data.error ?? `Erreur serveur (${res.status})`);
      } else {
        onUrlChange(data.url);
      }
    } catch {
      setUploadError("Impossible de contacter le serveur. Vérifiez que le serveur est démarré.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
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
      </div>

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

      {/* Upload + Delete row */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ background: "var(--blue)", color: "#fff", border: "none", padding: "9px 16px", font: "600 12px var(--sans)", cursor: uploading ? "wait" : "pointer", opacity: uploading ? .6 : 1, whiteSpace: "nowrap", borderRadius: 2 }}
        >
          {uploading ? "Envoi en cours…" : "📁 Charger une image"}
        </button>

        {(imgUrl || imgSeed) && (
          <button
            type="button"
            onClick={() => { onUrlChange(""); onSeedChange(""); setUploadError(""); }}
            style={{ background: "#c0392b", color: "#fff", border: "none", padding: "9px 14px", font: "600 12px var(--sans)", cursor: "pointer", whiteSpace: "nowrap", borderRadius: 2 }}
          >
            🗑 Supprimer l&apos;image
          </button>
        )}
      </div>

      {uploadError && (
        <p style={{ font: "400 12px var(--sans)", color: "#c0392b", margin: 0, background: "#fde8e8", padding: "8px 12px", borderRadius: 2 }}>
          ⚠ {uploadError}
        </p>
      )}

      {imgUrl && !uploadError && (
        <p style={{ font: "400 11px var(--sans)", color: "#4a8c4a", margin: 0 }}>
          ✓ Image uploadée : {imgUrl}
        </p>
      )}
    </div>
  );
}
