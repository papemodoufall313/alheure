"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      style={{ background: "none", border: "1px solid rgba(255,255,255,.25)", borderRadius: 4, color: "#a8b4cf", padding: "5px 12px", font: "500 12px var(--sans)", cursor: "pointer" }}
    >
      Déconnexion
    </button>
  );
}
