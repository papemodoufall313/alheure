"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = params.get("callbackUrl") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Identifiant ou mot de passe incorrect.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)" }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: 40, width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ font: "800 36px var(--serif)", fontStyle: "italic", color: "var(--blue)", lineHeight: 1 }}>
            <span style={{ color: "var(--red)" }}>À</span> l&apos;Heure
          </div>
          <div style={{ font: "500 11px var(--sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 6 }}>
            Espace rédaction
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)" }}>
              Identifiant
            </label>
            <input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              style={{ padding: "11px 14px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 15px var(--sans)", color: "var(--ink)", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ padding: "11px 14px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 15px var(--sans)", color: "var(--ink)", outline: "none" }}
            />
          </div>

          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", font: "500 13px var(--sans)", padding: "10px 14px", borderRadius: 4 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "13px", font: "700 14px var(--sans)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", textDecoration: "none" }}>
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
