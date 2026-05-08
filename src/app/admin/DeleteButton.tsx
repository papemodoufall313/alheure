"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    await fetch(`/api/articles/${slug}`, { method: "DELETE" });
    router.refresh();
    setConfirming(false);
  }

  return (
    <button
      onClick={handleDelete}
      style={{ font: "400 12px var(--sans)", color: confirming ? "#fff" : "var(--red)", background: confirming ? "var(--red)" : "transparent", padding: "4px 10px", border: "1px solid var(--red)", borderRadius: 2, cursor: "pointer" }}
    >
      {confirming ? "Confirmer" : "Supprimer"}
    </button>
  );
}
