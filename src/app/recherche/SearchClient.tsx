"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArticleImage from "@/components/ArticleImage";
import type { Article } from "@/lib/types";
import { artImgSrc } from "@/lib/imgSrc";

function highlight(text: string, query: string) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}

function searchArticles(articles: Article[], q: string): Article[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.dek.toLowerCase().includes(lower) ||
      a.rubriqueLabel.toLowerCase().includes(lower) ||
      (a.tags ?? []).some((t) => t.toLowerCase().includes(lower)) ||
      a.author.toLowerCase().includes(lower),
  );
}

export default function SearchClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    setQuery(q);
    setResults(searchArticles(articles, q));
    inputRef.current?.focus();
  }, [articles]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setResults(searchArticles(articles, q));
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
  }

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div style={{ borderBottom: "3px solid var(--blue)", paddingBottom: 24, marginBottom: 32 }}>
        <span style={{ font: "800 11px var(--sans)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-2)", display: "block", marginBottom: 12 }}>
          Recherche
        </span>
        <div style={{ display: "flex" }}>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Chercher un article, une rubrique, un auteur…"
            aria-label="Recherche"
            style={{ flex: 1, border: "2px solid var(--ink-3)", borderRight: "none", padding: "12px 16px", font: "400 16px var(--sans)", color: "var(--ink)", background: "var(--paper)", outline: "none" }}
          />
          <button aria-label="Lancer la recherche" style={{ background: "var(--blue)", color: "#fff", border: "none", padding: "12px 20px", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {query.trim() && (
        <p style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", marginBottom: 24 }}>
          {results.length > 0
            ? `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`
            : `Aucun résultat pour « ${query} »`}
        </p>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {results.map((a) => (
            <article key={a.slug} className="art artRow" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 20 }}>
              <div className="artImg" style={{ flex: "0 0 140px", aspectRatio: "16/9" }}>
                <ArticleImage src={artImgSrc(a.imgSeed, a.imgUrl, 400, 225)} alt={a.imgAlt} seed={a.imgSeed} w={400} h={225} fill sizes="140px" style={{ objectFit: "cover" }} />
              </div>
              <div className="artBody">
                <span className="rub">{a.rubriqueLabel}</span>
                <h3>
                  <Link href={`/article/${a.slug}`} dangerouslySetInnerHTML={{ __html: highlight(a.title, query.trim()) }} />
                </h3>
                <p className="dek" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: highlight(a.dek, query.trim()) }} />
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

      {!query.trim() && (
        <p style={{ font: "400 15px/1.6 var(--sans)", color: "var(--ink-2)" }}>
          Saisissez un mot-clé pour rechercher parmi les articles d&apos;À l&apos;Heure.
        </p>
      )}
    </div>
  );
}
