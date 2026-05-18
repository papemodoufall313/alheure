import "server-only";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Article, Podcast } from "./types";

const DATA_PATH = join(process.cwd(), "src/data/articles.json");

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function normalizeDate(a: Article): Article {
  if (!a.dateIso) return a;
  return { ...a, date: formatDate(a.dateIso) };
}

export function getAllArticles(): Article[] {
  try {
    const articles = JSON.parse(readFileSync(DATA_PATH, "utf-8")) as Article[];
    return articles.map(normalizeDate);
  } catch {
    return [];
  }
}

export function saveAllArticles(articles: Article[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

export function getArticlesByRubrique(slug: string): Article[] {
  return getAllArticles().filter((a) => a.rubrique === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getFeaturedArticle(): Article {
  const all = getAllArticles();
  return all.find((a) => a.featured && a.rubrique === "senegal") ?? all[0];
}

export function getSideArticles(excludeSlug: string, count = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== excludeSlug)
    .slice(0, count);
}

export function getAlaUne(): Article[] {
  const picks: Article["rubrique"][] = ["politique", "economie", "societe", "culture"];
  const all = getAllArticles();
  return picks.map((r) => all.find((a) => a.rubrique === r)!).filter(Boolean);
}

export const PODCASTS: Podcast[] = [
  {
    letter: "D", variant: "",
    show: "Les Décodeurs",
    title: "La CEDEAO peut-elle survivre au départ du Mali, du Burkina et du Niger ?",
    duration: "28 min",
    date: "Hier",
  },
  {
    letter: "T", variant: "b",
    show: "Téranga · Le portrait",
    title: "Aïssata Tall Sall : « la diplomatie sénégalaise se réinvente »",
    duration: "42 min",
    date: "Cette semaine",
  },
  {
    letter: "É", variant: "g",
    show: "Économie d'Afrique",
    title: "Pétrole sénégalais : à qui profite réellement la rente ?",
    duration: "35 min",
    date: "Lundi",
  },
];
