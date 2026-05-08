"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ARTICLES } from "@/lib/articles";
import type { Article } from "@/lib/types";

function highlight(text: string, query: string): string {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}

function search(q: string): Article[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.dek.toLowerCase().includes(lower) ||
      a.rubriqueLabel.toLowerCase().includes(lower) ||
      (a.tags ?? []).some((t) => t.toLowerCase().includes(lower)) ||
      a.author.toLowerCase().includes(lower),
  );
}

export default function RecherchePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    setQuery(q);
    setResults(search(q));
    inputRef.current?.focus();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setResults(search(q));
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
  }

  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div className="wrap" style={{ padding: "40px 28px 80px" }}>

          {/* Search bar */}
          <div style={{ borderBottom: "3px solid var(--blue)", paddingBottom: 24, marginBottom: 32 }}>
            <span style={{ font: "800 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-2)", display: "block", marginBottom: 12 }}>
              Recherche
            </span>
            <div style={{ display: "flex", gap: 0 }}>
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Chercher un article, une rubrique, un auteur…"
                aria-label="Recherche"
                style={{
                  flex: 1,
                  border: "2px solid var(--ink-3)",
                  borderRight: "none",
                  padding: "12px 16px",
                  font: "400 16px var(--sans)",
                  color: "var(--ink)",
                  background: "var(--paper)",
                  outline: "none",
                }}
              />
              <button
                aria-label="Lancer la recherche"
                style={{
                  background: "var(--blue)",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>

          {/* Results count */}
          {query.trim() && (
            <p style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", marginBottom: 24 }}>
              {results.length > 0
                ? `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`
                : `Aucun résultat pour « ${query} »`}
            </p>
          )}

          {/* Results list */}
          {results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {results.map((a) => (
                <article
                  key={a.slug}
                  className="art artRow"
                  style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 20 }}
                >
                  <div className="artImg" style={{ flex: "0 0 140px", aspectRatio: "16/9" }}>
                    <Image
                      src={`https://picsum.photos/seed/${a.imgSeed}/400/225`}
                      alt={a.imgAlt}
                      fill
                      sizes="140px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="artBody">
                    <span className="rub">{a.rubriqueLabel}</span>
                    <h3>
                      <Link
                        href={`/article/${a.slug}`}
                        dangerouslySetInnerHTML={{ __html: highlight(a.title, query.trim()) }}
                      />
                    </h3>
                    <p
                      className="dek"
                      style={{ fontSize: 13, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}
                      dangerouslySetInnerHTML={{ __html: highlight(a.dek, query.trim()) }}
                    />
                    <div className="artMeta">
                      <span className="by">{a.author}</span>
                      <span className="metaDot" />
                      <time dateTime={a.dateIso}>{a.date}</time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!query.trim() && (
            <p style={{ font: "400 15px/1.6 var(--sans)", color: "var(--ink-2)" }}>
              Saisissez un mot-clé pour rechercher parmi les articles d&apos;À l&apos;Heure.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
