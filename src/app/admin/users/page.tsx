"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  login: string;
  name: string;
  role: string;
}

const ROLES = ["admin", "editeur"];
const EMPTY = { id: "", login: "", name: "", role: "editeur", password: "", confirm: "" };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", error: false });

  useEffect(() => { fetch("/api/admin/users").then(r => r.json()).then(setUsers); }, []);

  function flash(text: string, error = false) {
    setMsg({ text, error });
    setTimeout(() => setMsg({ text: "", error: false }), 3000);
  }

  async function save() {
    if (!form.name || !form.login) return flash("Nom et identifiant obligatoires.", true);
    if (mode === "create" && !form.password) return flash("Mot de passe obligatoire.", true);
    if (form.password && form.password !== form.confirm) return flash("Les mots de passe ne correspondent pas.", true);
    if (form.password && form.password.length < 8) return flash("Mot de passe trop court (8 caractères min).", true);

    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: mode,
        id: form.id,
        login: form.login,
        name: form.name,
        role: form.role,
        password: form.password || undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (data.error) return flash(data.error, true);

    const updated = await fetch("/api/admin/users").then(r => r.json());
    setUsers(updated);
    setMode("idle");
    setForm({ ...EMPTY });
    flash(mode === "create" ? "Compte créé ✓" : "Modifié ✓");
  }

  async function remove(u: User) {
    if (!confirm(`Supprimer le compte « ${u.name} » ? Cette action est irréversible.`)) return;
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: u.id }),
    });
    setUsers(prev => prev.filter(x => x.id !== u.id));
    flash("Compte supprimé.");
  }

  const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
    admin:   { bg: "#fee2e2", color: "#dc2626" },
    editeur: { bg: "#dbeafe", color: "#1d4ed8" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "var(--sans)" }}>
      {/* Header */}
      <div style={{ background: "var(--blue)", color: "#fff", padding: "0 32px", marginBottom: 32 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/admin" style={{ font: "400 12px var(--sans)", color: "#a8b4cf", textDecoration: "none" }}>← Admin</a>
            <span style={{ font: "700 16px var(--serif)", fontStyle: "italic", color: "#fff" }}>Gestion des comptes</span>
          </div>
          {msg.text && (
            <span style={{ font: "600 13px var(--sans)", color: msg.error ? "#fca5a5" : "#86efac" }}>{msg.text}</span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 80px" }}>

        {/* Form */}
        {mode !== "idle" && (
          <div style={{ background: "#fff", border: `2px solid ${mode === "create" ? "var(--blue)" : "#f97316"}`, borderRadius: 8, padding: 28, marginBottom: 28 }}>
            <h2 style={{ font: "700 18px var(--serif)", margin: "0 0 20px" }}>
              {mode === "create" ? "Nouveau compte" : `Modifier — ${form.name}`}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[["Nom complet", "name", "text"], ["Identifiant de connexion", "login", "text"]].map(([label, key, type]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    disabled={mode === "edit" && key === "login"}
                    style={{ padding: "9px 12px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)", background: mode === "edit" && key === "login" ? "#f5f5f5" : "#fff" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", display: "block", marginBottom: 5 }}>Rôle</label>
              <div style={{ display: "flex", gap: 10 }}>
                {ROLES.map(r => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "8px 16px", border: `2px solid ${form.role === r ? "var(--blue)" : "var(--rule)"}`, borderRadius: 4, background: form.role === r ? "#eff6ff" : "#fff" }}>
                    <input type="radio" name="role" value={r} checked={form.role === r} onChange={() => setForm(p => ({ ...p, role: r }))} style={{ accentColor: "var(--blue)" }} />
                    <span style={{ font: "600 13px var(--sans)", textTransform: "capitalize", color: form.role === r ? "var(--blue)" : "var(--ink-2)" }}>{r}</span>
                  </label>
                ))}
              </div>
              <div style={{ font: "400 12px var(--sans)", color: "var(--ink-3)", marginTop: 6 }}>
                <strong>admin</strong> : accès complet · <strong>editeur</strong> : articles et médias
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["Mot de passe", "password"], ["Confirmer le mot de passe", "confirm"]].map(([label, key]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ font: "600 11px var(--sans)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>
                    {label}{mode === "edit" && " (laisser vide = inchangé)"}
                  </label>
                  <input
                    type="password"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={mode === "edit" ? "••••••••" : ""}
                    autoComplete="new-password"
                    style={{ padding: "9px 12px", border: "1.5px solid var(--rule)", borderRadius: 4, font: "400 14px var(--sans)" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} disabled={saving} style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "10px 24px", font: "700 13px var(--sans)", cursor: "pointer" }}>
                {saving ? "Sauvegarde…" : mode === "create" ? "Créer le compte" : "Enregistrer"}
              </button>
              <button onClick={() => { setMode("idle"); setForm({ ...EMPTY }); }} style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "10px 18px", font: "600 13px var(--sans)", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Users list */}
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ font: "700 16px var(--serif)", margin: 0 }}>Comptes ({users.length})</h2>
            {mode === "idle" && (
              <button onClick={() => { setMode("create"); setForm({ ...EMPTY }); }}
                style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", font: "700 12px var(--sans)", cursor: "pointer" }}>
                + Nouveau compte
              </button>
            )}
          </div>
          {users.map((u, i) => (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < users.length - 1 ? "1px solid var(--rule)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 16px var(--serif)", color: "#fff", flexShrink: 0 }}>
                  {u.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                    <span style={{ font: "600 15px var(--sans)", color: "var(--ink)" }}>{u.name}</span>
                    <span style={{ background: ROLE_STYLE[u.role]?.bg ?? "#f3f4f6", color: ROLE_STYLE[u.role]?.color ?? "#374151", font: "700 10px var(--sans)", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      {u.role}
                    </span>
                  </div>
                  <span style={{ font: "400 13px var(--sans)", color: "var(--ink-3)" }}>@{u.login}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setMode("edit"); setForm({ ...EMPTY, ...u, password: "", confirm: "" }); }}
                  style={{ background: "none", border: "1px solid var(--rule)", borderRadius: 4, padding: "6px 14px", font: "600 12px var(--sans)", cursor: "pointer", color: "var(--ink-2)" }}>
                  Modifier
                </button>
                <button onClick={() => remove(u)}
                  style={{ background: "none", border: "1px solid #fca5a5", borderRadius: 4, padding: "6px 12px", font: "600 12px var(--sans)", cursor: "pointer", color: "#dc2626" }}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
