"use client";
import { useState } from "react";
import Link from "next/link";
import { RUBRIQUES_NAV } from "@/lib/types";

export default function Nav({ activeRubrique = "À la une" }: { activeRubrique?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav" aria-label="Rubriques">
        <div className="wrap">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>

          {/* Desktop pill */}
          <button className="menuPill" aria-label="Toutes les rubriques" onClick={() => setOpen((v) => !v)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            RUBRIQUES
          </button>

          <ul role="list">
            {RUBRIQUES_NAV.map((r) => (
              <li key={r.slug} className={r.label === activeRubrique ? "active" : ""}>
                <Link href={r.slug ? `/rubrique/${r.slug}` : "/"}>
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navEnd">
            <a href="/videos" style={{ color: "var(--red)" }}>▶ VIDÉOS</a>
            <a href="/podcasts" style={{ color: "var(--blue)" }}>♪ PODCASTS</a>
            <a href="/wolof" style={{ color: "#0a5a3a" }}>🇸🇳 WOLOF</a>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="mobileNavOverlay" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="mobileNav" role="dialog" aria-label="Menu de navigation">
            <div className="mobileNavHead">
              <span style={{ font: "800 13px var(--sans)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                Rubriques
              </span>
              <button
                className="mobileNavClose"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="mobileNavList" role="list">
              {RUBRIQUES_NAV.map((r) => (
                <li key={r.slug} className={r.label === activeRubrique ? "active" : ""}>
                  <Link
                    href={r.slug ? `/rubrique/${r.slug}` : "/"}
                    onClick={() => setOpen(false)}
                  >
                    {r.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mobileNavFooter">
              <a href="/videos" style={{ color: "var(--red)", font: "700 13px var(--sans)" }}>▶ VIDÉOS</a>
              <a href="/podcasts" style={{ color: "var(--blue)", font: "700 13px var(--sans)" }}>♪ PODCASTS</a>
              <a href="/newsletter" style={{ color: "var(--ink-2)", font: "700 13px var(--sans)" }}>✉ NEWSLETTER</a>
              <a href="/wolof" style={{ color: "#0a5a3a", font: "700 13px var(--sans)" }}>🇸🇳 WOLOF</a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
